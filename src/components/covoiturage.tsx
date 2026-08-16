import { useEffect, useRef, useState } from "react";
import { Check, Copy, MessageCircle, Pencil, Phone, Trash2, Users } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useLang, useT } from "@/lib/i18n";
import {
  createTrip,
  dateLabel,
  deleteTrip,
  fetchTrips,
  slotLabel,
  SLOTS,
  tripSummary,
  updateTrip,
  whatsappHref,
  type Trip,
  type TripInput,
} from "@/lib/covoiturage";

const DESTINATION = "Couvent Notre-Dame des Prés, Reillanne";

// `min-h-11` : 44 px, la plus petite cible tactile confortable sur téléphone.
// Les `select` natifs se contentent sinon d'une quarantaine de pixels.
const fieldClass =
  "mt-2 min-h-11 w-full border-0 border-b border-border bg-transparent py-2.5 text-[0.95rem] text-ink placeholder:text-muted-foreground/55 focus:border-olive focus:outline-none";
const labelClass = "font-display text-[0.68rem] tracking-[0.22em] uppercase text-olive";
const buttonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 border border-olive/50 px-6 py-3 font-display text-[0.75rem] tracking-[0.2em] uppercase text-ink transition-colors hover:bg-olive hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 sm:text-[0.68rem] sm:tracking-[0.24em]";
// Les actions d'une carte. Elles sont posées sur une grille de deux colonnes :
// sur un iPhone SE, quatre boutons étirés sur toute la largeur mangeaient un
// écran entier à eux seuls.
const cardActionsClass = "grid grid-cols-2 gap-3";
const cardActionClass =
  "inline-flex min-h-11 items-center justify-center gap-2 border border-border px-3 py-2 font-display text-[0.66rem] tracking-[0.14em] uppercase text-ink transition-colors hover:border-olive hover:text-olive sm:px-4 sm:text-[0.68rem] sm:tracking-[0.18em]";

type FormState = {
  name: string;
  phone: string;
  whatsapp: boolean;
  origin: string;
  destination: string;
  arrivalDate: string;
  arrivalSlot: string;
  departureDate: string;
  departureSlot: string;
  returnElsewhere: boolean;
  returnDestination: string;
  seats: string;
  comment: string;
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  whatsapp: true,
  origin: "",
  destination: DESTINATION,
  arrivalDate: "",
  arrivalSlot: "16",
  departureDate: "",
  departureSlot: "",
  returnElsewhere: false,
  returnDestination: "",
  seats: "1",
  comment: "",
};

function formFromTrip(trip: Trip): FormState {
  return {
    name: trip.name,
    phone: trip.phone,
    whatsapp: trip.whatsapp,
    origin: trip.origin,
    destination: trip.destination,
    arrivalDate: trip.arrival_date,
    arrivalSlot: String(trip.arrival_slot),
    departureDate: trip.departure_date ?? "",
    departureSlot: trip.departure_slot == null ? "" : String(trip.departure_slot),
    returnElsewhere: Boolean(trip.return_destination),
    returnDestination: trip.return_destination ?? "",
    seats: String(trip.seats),
    comment: trip.comment ?? "",
  };
}

/**
 * Le tableau de covoiturage entre invités : la liste des trajets déjà
 * proposés, puis le formulaire pour y ajouter le sien, le corriger ou le
 * retirer.
 *
 * La liste est chargée depuis le navigateur et non au rendu serveur. C'est
 * volontaire : les numéros de téléphone des invités n'apparaissent ainsi pas
 * dans le HTML servi aux robots d'indexation.
 *
 * Si la table n'est pas joignable, la section ne tombe pas en panne : la liste
 * s'efface et le formulaire propose un récapitulatif à copier.
 */
export function Covoiturage() {
  const t = useT();
  const lang = useLang();
  const c = t.covoiturage;

  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [boardOpen, setBoardOpen] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "invalid" | "fallback">(
    "idle",
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    fetchTrips()
      .then((rows) => alive && setTrips(rows))
      .catch(() => {
        if (!alive) return;
        setTrips([]);
        setBoardOpen(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function startEdit(trip: Trip) {
    setForm(formFromTrip(trip));
    setEditingId(trip.id);
    setStatus("idle");
    setNotice(null);
    // Sur téléphone la carte et le formulaire sont à plusieurs écrans l'un de
    // l'autre : sans ce défilement, le clic sur « Modifier » semblerait sans
    // effet.
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cancelEdit() {
    setForm(emptyForm);
    setEditingId(null);
    setStatus("idle");
  }

  async function remove(trip: Trip) {
    setNotice(null);
    try {
      await deleteTrip(trip.id);
      setTrips(await fetchTrips());
      if (editingId === trip.id) cancelEdit();
      setNotice(c.removed);
    } catch {
      setNotice(c.actionFailed);
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const required = [form.name, form.phone, form.origin, form.destination, form.arrivalDate];
    if (required.some((v) => !v.trim())) {
      setStatus("invalid");
      return;
    }

    const trip: TripInput = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp,
      origin: form.origin.trim(),
      destination: form.destination.trim(),
      arrival_date: form.arrivalDate,
      arrival_slot: Number(form.arrivalSlot),
      departure_date: form.departureDate || null,
      departure_slot: form.departureDate && form.departureSlot ? Number(form.departureSlot) : null,
      seats: Number(form.seats),
      comment: form.comment.trim() || null,
    };

    // La destination de retour n'est jointe qu'en cas de besoin : tant que la
    // colonne n'existe pas côté base, PostgREST refuserait tout envoi la
    // mentionnant, même à vide — et plus personne ne pourrait s'inscrire.
    // La correction d'un trajet, elle, suppose déjà la nouvelle version.
    const returnDestination = form.returnElsewhere ? form.returnDestination.trim() : "";
    if (returnDestination || editingId) trip.return_destination = returnDestination || null;

    setStatus("sending");
    setNotice(null);
    try {
      if (editingId) await updateTrip(editingId, trip);
      else await createTrip(trip);
      setTrips(await fetchTrips());
      setBoardOpen(true);
      setNotice(editingId ? c.edited : null);
      setForm(emptyForm);
      setEditingId(null);
      setStatus("done");
    } catch {
      setSummary(tripSummary(trip, lang));
      setStatus("fallback");
    }
  }

  const editing = editingId !== null;

  return (
    <section id="covoiturage" className="border-t border-border bg-sage-soft/30">
      <div className="container-page py-16 sm:py-24">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="mt-5 display-md text-ink">{c.heading}</h2>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-muted-foreground">{c.intro}</p>
        </Reveal>

        {boardOpen ? (
          <div className="mt-14">
            <Reveal>
              <h3 className="font-display text-[0.72rem] tracking-[0.24em] uppercase text-ink">
                {c.listHeading}
              </h3>
              {trips && trips.length > 0 ? (
                <p className="mt-3 text-[0.85rem] leading-relaxed text-muted-foreground">
                  {c.listNote}
                </p>
              ) : null}
            </Reveal>

            {notice ? (
              <p role="status" className="mt-5 text-[0.9rem] text-ink">
                {notice}
              </p>
            ) : null}

            {trips === null ? (
              <p className="mt-6 text-[0.9rem] text-muted-foreground">{c.loading}</p>
            ) : trips.length === 0 ? (
              <Reveal className="mt-6 border border-dashed border-border bg-background/60 px-8 py-10 text-center">
                <p className="mx-auto max-w-md text-[0.92rem] leading-relaxed text-muted-foreground">
                  {c.empty}
                </p>
              </Reveal>
            ) : (
              // Des cartes bordées une à une, séparées par un écart, plutôt que
              // la grille à filets de la page Hébergements : le nombre de
              // trajets est quelconque, et une dernière rangée incomplète y
              // laisserait des cases grises.
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {trips.map((trip, i) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    delay={i * 60}
                    active={editingId === trip.id}
                    onEdit={() => startEdit(trip)}
                    onRemove={() => remove(trip)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Le formulaire, en saisie comme en correction. Le `ref` est porté par
            une enveloppe : `Reveal` ne transmet pas les siens. */}
        <div ref={formRef} className="mt-16 scroll-mt-24">
          <Reveal className="border border-border bg-background p-8 sm:p-12">
            <h3 className="font-serif text-2xl leading-snug font-light text-ink">
              {editing ? c.editHeading : c.formHeading}
            </h3>
            <p className="mt-3 max-w-xl text-[0.9rem] leading-relaxed text-muted-foreground">
              {editing ? c.editIntro : c.formIntro}
            </p>

            {status === "done" ? (
              <div className="mt-8">
                <p className="text-[0.95rem] leading-relaxed text-ink">{notice ?? c.success}</p>
                <button
                  type="button"
                  onClick={() => {
                    setNotice(null);
                    setStatus("idle");
                  }}
                  className={`${buttonClass} mt-6`}
                >
                  {c.again}
                </button>
              </div>
            ) : (
              <form
                onSubmit={submit}
                className="mt-9 grid gap-x-10 gap-y-7 sm:grid-cols-2"
                noValidate
              >
                <Field label={c.fields.name} required>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    autoComplete="name"
                    maxLength={80}
                    className={fieldClass}
                  />
                </Field>

                <Field label={c.fields.phone} required hint={c.fields.phoneHint}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={40}
                    placeholder="+33 6 12 34 56 78"
                    className={fieldClass}
                  />
                </Field>

                <Choice
                  legend={c.fields.whatsapp}
                  yes={c.fields.yes}
                  no={c.fields.no}
                  value={form.whatsapp}
                  onChange={(v) => set("whatsapp", v)}
                />

                <Field label={c.fields.origin} required>
                  <input
                    type="text"
                    value={form.origin}
                    onChange={(e) => set("origin", e.target.value)}
                    maxLength={120}
                    placeholder={c.fields.originPlaceholder}
                    className={fieldClass}
                  />
                </Field>

                <Field label={c.fields.destination} required>
                  <input
                    type="text"
                    value={form.destination}
                    onChange={(e) => set("destination", e.target.value)}
                    maxLength={120}
                    placeholder={c.fields.destinationPlaceholder}
                    className={fieldClass}
                  />
                </Field>

                <Field label={c.fields.arrivalDate} required>
                  <input
                    type="date"
                    value={form.arrivalDate}
                    onChange={(e) => set("arrivalDate", e.target.value)}
                    className={fieldClass}
                  />
                </Field>

                <Field label={c.fields.arrivalTime}>
                  <select
                    value={form.arrivalSlot}
                    onChange={(e) => set("arrivalSlot", e.target.value)}
                    className={fieldClass}
                  >
                    {SLOTS.map((s) => (
                      <option key={s} value={s}>
                        {slotLabel(s, lang)}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label={c.fields.departureDate} optional={c.fields.optional}>
                  <input
                    type="date"
                    value={form.departureDate}
                    onChange={(e) => set("departureDate", e.target.value)}
                    className={fieldClass}
                  />
                </Field>

                <Field label={c.fields.departureTime} optional={c.fields.optional}>
                  <select
                    value={form.departureSlot}
                    onChange={(e) => set("departureSlot", e.target.value)}
                    className={fieldClass}
                  >
                    <option value="">— {c.fields.choose} —</option>
                    {SLOTS.map((s) => (
                      <option key={s} value={s}>
                        {slotLabel(s, lang)}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Le retour ne ramène pas toujours au point de départ : on
                  repart souvent vers un aéroport ou une gare. */}
                <Choice
                  legend={c.fields.returnElsewhere}
                  yes={c.fields.yes}
                  no={c.fields.no}
                  value={form.returnElsewhere}
                  onChange={(v) => set("returnElsewhere", v)}
                />

                {form.returnElsewhere ? (
                  <div className="sm:col-span-2">
                    <Field label={c.fields.returnDestination}>
                      <input
                        type="text"
                        value={form.returnDestination}
                        onChange={(e) => set("returnDestination", e.target.value)}
                        maxLength={120}
                        placeholder={c.fields.returnDestinationPlaceholder}
                        className={fieldClass}
                      />
                    </Field>
                  </div>
                ) : null}

                <Field label={c.fields.seats}>
                  <select
                    value={form.seats}
                    onChange={(e) => set("seats", e.target.value)}
                    className={fieldClass}
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="sm:col-span-2">
                  <Field label={c.fields.comment} optional={c.fields.optional}>
                    <textarea
                      value={form.comment}
                      onChange={(e) => set("comment", e.target.value)}
                      rows={3}
                      maxLength={400}
                      placeholder={c.fields.commentPlaceholder}
                      className={`${fieldClass} resize-none`}
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <p className="max-w-2xl text-[0.82rem] leading-relaxed text-muted-foreground">
                    {c.consent}
                  </p>
                  {status === "invalid" ? (
                    <p role="alert" className="mt-4 text-[0.88rem] text-ink">
                      {c.invalid}
                    </p>
                  ) : null}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button type="submit" disabled={status === "sending"} className={buttonClass}>
                      {status === "sending"
                        ? editing
                          ? c.saving
                          : c.submitting
                        : editing
                          ? c.save
                          : c.submit}
                    </button>
                    {editing ? (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className={`${buttonClass} border-border`}
                      >
                        {c.cancel}
                      </button>
                    ) : null}
                  </div>
                </div>
              </form>
            )}

            {status === "fallback" ? (
              <div className="mt-10 border-t border-border pt-8">
                <h4 className="font-display text-[0.72rem] tracking-[0.24em] uppercase text-ink">
                  {c.fallbackHeading}
                </h4>
                <p className="mt-3 max-w-xl text-[0.9rem] leading-relaxed text-muted-foreground">
                  {c.fallbackText}
                </p>
                <pre className="mt-5 overflow-x-auto border border-border bg-sand/30 p-5 font-sans text-[0.85rem] leading-relaxed whitespace-pre-wrap text-ink">
                  {summary}
                </pre>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText(summary);
                    setCopied(true);
                  }}
                  className={`${buttonClass} mt-5`}
                >
                  {copied ? (
                    <Check className="size-4" strokeWidth={1.3} />
                  ) : (
                    <Copy className="size-4" strokeWidth={1.3} />
                  )}
                  {copied ? c.copied : c.copy}
                </button>
              </div>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Un couple de boutons oui / non, plus sûr du pouce qu'une case à cocher. */
function Choice({
  legend,
  yes,
  no,
  value,
  onChange,
}: {
  legend: string;
  yes: string;
  no: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <fieldset className="sm:col-span-2">
      <legend className={labelClass}>{legend}</legend>
      <div className="mt-3 flex gap-3">
        {[true, false].map((option) => (
          <button
            key={String(option)}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`min-h-11 border px-6 py-2.5 font-display text-[0.72rem] tracking-[0.18em] uppercase transition-colors ${
              value === option
                ? "border-olive bg-olive text-primary-foreground"
                : "border-border text-muted-foreground hover:border-olive/60 hover:text-ink"
            }`}
          >
            {option ? yes : no}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Field({
  label,
  required,
  optional,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
        {optional ? (
          <span className="ml-2 font-sans text-[0.72rem] tracking-normal normal-case text-muted-foreground/70">
            ({optional})
          </span>
        ) : null}
      </span>
      {children}
      {hint ? (
        <span className="mt-2 block text-[0.78rem] text-muted-foreground/80">{hint}</span>
      ) : null}
    </label>
  );
}

function TripCard({
  trip,
  delay,
  active,
  onEdit,
  onRemove,
}: {
  trip: Trip;
  delay: number;
  active: boolean;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const c = t.covoiturage;
  const wa = trip.whatsapp ? whatsappHref(trip.phone) : null;
  // Une suppression est irréversible et le bouton est petit : le premier clic
  // ne fait qu'armer le second.
  const [confirming, setConfirming] = useState(false);

  return (
    <Reveal
      delay={delay}
      className={`flex flex-col border bg-background p-6 transition-colors duration-500 sm:p-8 ${
        active ? "border-olive bg-sand/30" : "border-border hover:bg-sand/25"
      }`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="font-serif text-[1.35rem] leading-snug font-light text-ink">{trip.name}</h4>
        <span className="inline-flex shrink-0 items-center gap-1.5 font-display text-[0.66rem] tracking-[0.18em] uppercase text-olive">
          <Users className="size-3.5" strokeWidth={1.3} />
          {trip.seats === 0
            ? c.seatsNone
            : `${trip.seats} ${trip.seats > 1 ? c.seatsMany : c.seatsOne}`}
        </span>
      </div>

      <p className="mt-4 text-[0.95rem] leading-relaxed text-ink">
        {trip.origin}
        <span className="mx-2 text-olive">→</span>
        {trip.destination}
      </p>

      <dl className="mt-5 space-y-1.5 text-[0.88rem] text-muted-foreground">
        <div className="flex gap-2">
          <dt className="shrink-0 text-olive">{c.arrival}</dt>
          <dd>
            {dateLabel(trip.arrival_date, lang)} · {slotLabel(trip.arrival_slot, lang)}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-olive">{c.departure}</dt>
          <dd>
            {trip.departure_date
              ? `${dateLabel(trip.departure_date, lang)}${
                  trip.departure_slot == null ? "" : ` · ${slotLabel(trip.departure_slot, lang)}`
                }${trip.return_destination ? ` ${c.returnTo} ${trip.return_destination}` : ""}`
              : c.departureUnknown}
          </dd>
        </div>
      </dl>

      {trip.comment ? (
        <p className="mt-5 border-l border-border pl-4 text-[0.88rem] leading-relaxed text-muted-foreground italic">
          {trip.comment}
        </p>
      ) : null}

      <div className={`mt-auto pt-7 ${cardActionsClass}`}>
        <a
          href={`tel:${trip.phone.replace(/\s/g, "")}`}
          className={`${cardActionClass} border-olive/40`}
        >
          <Phone className="size-3.5" strokeWidth={1.3} />
          {c.call}
        </a>
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noreferrer noopener"
            className={`${cardActionClass} border-olive/40`}
          >
            <MessageCircle className="size-3.5" strokeWidth={1.3} />
            {c.whatsapp}
          </a>
        ) : null}
      </div>

      {/* En attente de confirmation, « Modifier » cède sa place : la grille
          garde ainsi ses deux colonnes et le choix reste binaire. */}
      <div className={`mt-3 ${cardActionsClass}`}>
        {confirming ? (
          <>
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                onRemove();
              }}
              className={`${cardActionClass} border-olive bg-olive text-primary-foreground hover:text-primary-foreground`}
            >
              <Trash2 className="size-3.5" strokeWidth={1.3} />
              {c.confirmRemove}
            </button>
            <button type="button" onClick={() => setConfirming(false)} className={cardActionClass}>
              {c.cancel}
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={onEdit} className={cardActionClass}>
              <Pencil className="size-3.5" strokeWidth={1.3} />
              {c.edit}
            </button>
            <button type="button" onClick={() => setConfirming(true)} className={cardActionClass}>
              <Trash2 className="size-3.5" strokeWidth={1.3} />
              {c.remove}
            </button>
          </>
        )}
      </div>
    </Reveal>
  );
}
