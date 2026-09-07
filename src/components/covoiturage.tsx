import { useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  MessageCircle,
  Plus,
  Pencil,
  Phone,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useLang, useT } from "@/lib/i18n";
import {
  createTrip,
  dateLabel,
  deleteTrip,
  fetchTrips,
  joinTrip,
  removePassenger,
  renamePassenger,
  slotLabel,
  SLOTS,
  tripSummary,
  updateTrip,
  whatsappHref,
  type Trip,
  type TripInput,
} from "@/lib/covoiturage";
import { INDICATIFS, joinPhone, OTHER_CODE, splitPhone } from "@/lib/indicatifs";

const DESTINATION = "Couvent Notre-Dame des Prés, Reillanne";

// `min-h-11` : 44 px, la plus petite cible tactile confortable sur téléphone.
// Les `select` natifs se contentent sinon d'une quarantaine de pixels.
const fieldClass =
  "mt-2 min-h-11 w-full border-0 border-b border-border bg-transparent py-2.5 text-[0.95rem] text-ink placeholder:text-muted-foreground/55 focus:border-olive focus:outline-none";
// La même allure, sans `mt-2 w-full` : à l'intérieur d'une rangée souple, une
// largeur de 100 % couplée à `shrink-0` ferait tout prendre au premier champ
// et ne laisserait rien au suivant.
const fieldInline =
  "min-h-11 border-0 border-b border-border bg-transparent py-2.5 text-[0.95rem] text-ink placeholder:text-muted-foreground/55 focus:border-olive focus:outline-none";
const labelClass = "font-display text-[0.68rem] tracking-[0.22em] uppercase text-olive";
const labelTodoClass = "font-display text-[0.68rem] tracking-[0.22em] uppercase text-clay";
const buttonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 border border-olive/50 px-6 py-3 font-display text-[0.75rem] tracking-[0.2em] uppercase text-ink transition-colors hover:bg-olive hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 sm:text-[0.68rem] sm:tracking-[0.24em]";
// Les actions d'une carte. Elles sont posées sur une grille de deux colonnes :
// sur un iPhone SE, quatre boutons étirés sur toute la largeur mangeaient un
// écran entier à eux seuls.
const cardActionClass =
  "inline-flex min-h-11 items-center justify-center gap-2 border border-border px-3 py-2 font-display text-[0.66rem] tracking-[0.14em] uppercase text-ink transition-colors hover:border-olive hover:text-olive sm:px-4 sm:text-[0.68rem] sm:tracking-[0.18em]";

type FormState = {
  name: string;
  phoneCode: string;
  phoneOther: string;
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
  seatsReturn: string;
  comment: string;
  passengers: string;
};

const emptyForm: FormState = {
  name: "",
  phoneCode: "+33",
  phoneOther: "",
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
  seats: "",
  seatsReturn: "",
  comment: "",
  passengers: "",
};

function formFromTrip(trip: Trip): FormState {
  const { code, local } = splitPhone(trip.phone);
  const known = INDICATIFS.some((i) => i.code === code);
  return {
    name: trip.name,
    phoneCode: known ? code : OTHER_CODE,
    phoneOther: known ? "" : code,
    phone: local,
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
    seatsReturn: trip.seats_return == null ? "" : String(trip.seats_return),
    comment: trip.comment ?? "",
    passengers: trip.passengers ?? "",
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
  const [status, setStatus] = useState<"idle" | "sending" | "invalid" | "badPhone" | "fallback">(
    "idle",
  );
  // Le formulaire est replié à l'arrivée : on vient d'abord voir les trajets
  // des autres, et douze champs déployés repoussaient la liste hors de l'écran.
  const [formOpen, setFormOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

  // Les champs indispensables encore vides. Ils ne se colorent qu'après une
  // première tentative d'envoi : souligner en terre cuite un formulaire vierge
  // reviendrait à gronder quelqu'un qui n'a pas encore commencé.
  const REQUIRED = ["name", "phone", "origin", "destination", "arrivalDate", "seats"] as const;
  const missing = REQUIRED.filter((k) => !form[k].trim());
  const flagged = (key: (typeof REQUIRED)[number]) => status === "invalid" && missing.includes(key);

  function openForm() {
    setFormOpen(true);
    // Le dépliement et le défilement doivent se suivre : sans l'attente d'un
    // rendu, la cible n'existe pas encore et le navigateur ne bouge pas.
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }

  function closeForm() {
    setFormOpen(false);
    setForm(emptyForm);
    setEditingId(null);
    setStatus("idle");
  }

  function startEdit(trip: Trip) {
    setForm(formFromTrip(trip));
    setEditingId(trip.id);
    setStatus("idle");
    setNotice(null);
    setFormOpen(true);
    // Sur téléphone la carte et le formulaire sont à plusieurs écrans l'un de
    // l'autre : sans ce défilement, le clic sur « Modifier » semblerait sans
    // effet.
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function join(trip: Trip, name: string) {
    setNotice(null);
    try {
      await joinTrip(trip.id, name);
      setTrips(await fetchTrips());
      setNotice(c.joined);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setNotice(/complète|full/i.test(message) ? c.joinFull : c.actionFailed);
    }
  }

  async function passenger(trip: Trip, from: string, to: string | null) {
    setNotice(null);
    try {
      if (to === null) await removePassenger(trip.id, from);
      else await renamePassenger(trip.id, from, to);
      setTrips(await fetchTrips());
      setNotice(to === null ? c.passengerRemoved : c.passengerRenamed);
    } catch {
      setNotice(c.actionFailed);
    }
  }

  async function remove(trip: Trip) {
    setNotice(null);
    try {
      await deleteTrip(trip.id);
      setTrips(await fetchTrips());
      if (editingId === trip.id) closeForm();
      setNotice(c.removed);
    } catch {
      setNotice(c.actionFailed);
    }
  }

  // L'indicatif vient d'une liste, le numéro du champ : il ne peut plus
  // s'oublier. Reste à vérifier qu'il y a bien assez de chiffres.
  const dialCode = form.phoneCode === OTHER_CODE ? form.phoneOther.trim() : form.phoneCode;
  const fullPhone = joinPhone(dialCode, form.phone);
  const phoneOk = /^\+[1-9]\d{0,3}$/.test(dialCode) && form.phone.replace(/\D/g, "").length >= 6;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (missing.length > 0) {
      setStatus("invalid");
      return;
    }
    if (!phoneOk) {
      setStatus("badPhone");
      return;
    }

    const trip: TripInput = {
      name: form.name.trim(),
      phone: fullPhone,
      whatsapp: form.whatsapp,
      origin: form.origin.trim(),
      destination: form.destination.trim(),
      arrival_date: form.arrivalDate,
      arrival_slot: Number(form.arrivalSlot),
      departure_date: form.departureDate || null,
      departure_slot: form.departureDate && form.departureSlot ? Number(form.departureSlot) : null,
      seats: Number(form.seats),
      comment: form.comment.trim() || null,
      passengers: form.passengers.trim() || null,
      return_destination: form.returnElsewhere ? form.returnDestination.trim() || null : null,
      seats_return: form.departureDate && form.seatsReturn ? Number(form.seatsReturn) : null,
    };

    setStatus("sending");
    setNotice(null);
    try {
      if (editingId) await updateTrip(editingId, trip);
      else await createTrip(trip);
      setTrips(await fetchTrips());
      setBoardOpen(true);
      // La confirmation s'affiche au-dessus de la liste, et non dans le
      // formulaire : on veut voir du même coup d'œil le message et le trajet
      // qui vient d'y apparaître. D'où le repli et le défilement.
      setNotice(editingId ? c.edited : c.success);
      setForm(emptyForm);
      setEditingId(null);
      setFormOpen(false);
      setStatus("idle");
      requestAnimationFrame(() =>
        listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
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
          <div ref={listRef} className="mt-16 scroll-mt-24">
            <Reveal>
              <h3 className="font-display text-[0.72rem] tracking-[0.24em] uppercase text-ink">
                {c.listHeading}
                {trips?.length ? (
                  <span className="ml-2 font-sans normal-case tracking-normal text-muted-foreground">
                    · {trips.length} {trips.length > 1 ? c.tripsCountMany : c.tripsCount}
                  </span>
                ) : null}
              </h3>
              {trips && trips.length > 0 ? (
                <p className="mt-3 text-[0.85rem] leading-relaxed text-muted-foreground">
                  {c.listNote}
                </p>
              ) : null}
            </Reveal>

            {notice ? (
              <p
                role="status"
                className="mt-5 border-l-2 border-olive bg-sage-soft/60 px-4 py-3 text-[0.9rem] text-ink"
              >
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
              // Une liste de lignes, et non une grille de cartes : on parcourt
              // des trajets pour en comparer les horaires et les places, et
              // trois colonnes de pavés obligeaient à balayer l'écran en
              // zigzag. Une ligne par trajet, les mêmes données toujours à la
              // même place.
              <>
                {/* Un en-tête de colonnes, sur écran large seulement : il dit
                    ce qu'on lit sans avoir à le deviner ligne après ligne. */}
                <div
                  aria-hidden="true"
                  className={`mt-6 hidden border-b border-border pb-2 font-display text-[0.6rem] tracking-[0.18em] uppercase text-olive sm:grid ${rowGrid}`}
                >
                  <span>{c.colTrip}</span>
                  <span>{c.colWhen}</span>
                  <span>{c.colContact}</span>
                  <span />
                </div>
                <ul className="divide-y divide-border border-b border-border sm:border-t-0">
                  {trips.map((trip, i) => (
                    <TripRow
                      key={trip.id}
                      trip={trip}
                      delay={i * 60}
                      active={editingId === trip.id}
                      onEdit={() => startEdit(trip)}
                      onRemove={() => remove(trip)}
                      onJoin={(name) => join(trip, name)}
                      onPassenger={(from, to) => passenger(trip, from, to)}
                    />
                  ))}
                </ul>
              </>
            )}
          </div>
        ) : null}

        {/* Le formulaire, en saisie comme en correction. Replié par défaut :
            douze champs ne méritent pas d'occuper la page en permanence alors
            qu'on vient d'abord consulter les trajets. Le `ref` est porté par
            une enveloppe, `Reveal` ne transmettant pas les siens. */}
        <div ref={formRef} className="mt-12 scroll-mt-24">
          {formOpen ? (
            <div className="border border-border bg-background p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <h3 className="font-serif text-[1.6rem] leading-snug font-light text-ink">
                  {editing ? c.editHeading : c.formHeading}
                </h3>
                <button
                  type="button"
                  onClick={closeForm}
                  className="inline-flex min-h-8 items-center gap-1.5 font-display text-[0.64rem] tracking-[0.14em] uppercase text-muted-foreground transition-colors hover:text-ink"
                >
                  <X className="size-3" strokeWidth={1.6} />
                  {c.formClose}
                </button>
              </div>
              <p className="mt-2 max-w-xl text-[0.88rem] leading-relaxed text-muted-foreground">
                {editing ? c.editIntro : c.formIntro}
              </p>

              <form
                onSubmit={submit}
                className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2"
                noValidate
              >
                <Field
                  label={c.fields.name}
                  required
                  todo={flagged("name")}
                  todoLabel={c.toComplete}
                >
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    autoComplete="name"
                    maxLength={80}
                    className={fieldClass}
                  />
                </Field>

                {/* L'indicatif d'abord, choisi dans une liste : c'est ce qui
                    empêche de l'oublier. Le champ ne reçoit ensuite que le
                    numéro local. */}
                <Field
                  label={c.fields.phone}
                  required
                  hint={c.fields.phoneHint}
                  todo={flagged("phone") || status === "badPhone"}
                  todoLabel={c.toComplete}
                >
                  <div className="mt-2 flex gap-3">
                    <select
                      value={form.phoneCode}
                      onChange={(e) => set("phoneCode", e.target.value)}
                      aria-label={c.fields.phoneCountry}
                      className={`${fieldInline} w-[8.5rem] shrink-0`}
                    >
                      {INDICATIFS.map((i) => (
                        <option key={i.code} value={i.code}>
                          {i.label}
                        </option>
                      ))}
                      <option value={OTHER_CODE}>{c.fields.phoneOther}</option>
                    </select>
                    {form.phoneCode === OTHER_CODE ? (
                      <input
                        type="tel"
                        value={form.phoneOther}
                        onChange={(e) => set("phoneOther", e.target.value)}
                        aria-label={c.fields.phoneOther}
                        maxLength={5}
                        placeholder="+000"
                        className={`${fieldInline} w-16 shrink-0`}
                      />
                    ) : null}
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      aria-label={c.fields.phoneNumber}
                      autoComplete="tel-national"
                      inputMode="tel"
                      maxLength={24}
                      placeholder="6 12 34 56 78"
                      className={`${fieldInline} min-w-0 flex-1`}
                    />
                  </div>
                </Field>

                <Choice
                  legend={c.fields.whatsapp}
                  yes={c.fields.yes}
                  no={c.fields.no}
                  value={form.whatsapp}
                  onChange={(v) => set("whatsapp", v)}
                />

                <Field
                  label={c.fields.origin}
                  required
                  todo={flagged("origin")}
                  todoLabel={c.toComplete}
                >
                  <input
                    type="text"
                    value={form.origin}
                    onChange={(e) => set("origin", e.target.value)}
                    maxLength={120}
                    placeholder={c.fields.originPlaceholder}
                    className={fieldClass}
                  />
                </Field>

                <Field
                  label={c.fields.destination}
                  required
                  todo={flagged("destination")}
                  todoLabel={c.toComplete}
                >
                  <input
                    type="text"
                    value={form.destination}
                    onChange={(e) => set("destination", e.target.value)}
                    maxLength={120}
                    placeholder={c.fields.destinationPlaceholder}
                    className={fieldClass}
                  />
                </Field>

                <Field
                  label={c.fields.arrivalDate}
                  required
                  todo={flagged("arrivalDate")}
                  todoLabel={c.toComplete}
                >
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

                {/* Sans valeur pré-cochée : c'est le renseignement qui rend
                    la liste utile, on ne peut pas le deviner à sa place. */}
                <Field
                  label={c.fields.seats}
                  required
                  todo={flagged("seats")}
                  todoLabel={c.toComplete}
                >
                  <select
                    value={form.seats}
                    onChange={(e) => set("seats", e.target.value)}
                    className={fieldClass}
                  >
                    <option value="">— {c.fields.seatsChoose} —</option>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Une voiture pleine à l'arrivée peut repartir à moitié vide.
                    La question ne se pose qu'une fois la date de retour donnée. */}
                {form.departureDate ? (
                  <Field label={c.fields.seatsReturn} optional={c.fields.optional}>
                    <select
                      value={form.seatsReturn}
                      onChange={(e) => set("seatsReturn", e.target.value)}
                      className={fieldClass}
                    >
                      <option value="">— {c.fields.choose} —</option>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </Field>
                ) : null}

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
                  {status === "invalid" || status === "badPhone" ? (
                    <p
                      role="alert"
                      className="mt-4 border-l-2 border-clay bg-clay-soft px-4 py-3 text-[0.88rem] text-clay"
                    >
                      {status === "badPhone" ? c.invalidPhone : c.invalid}
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
                        onClick={closeForm}
                        className={`${buttonClass} border-border`}
                      >
                        {c.cancel}
                      </button>
                    ) : null}
                  </div>
                </div>
              </form>

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
            </div>
          ) : (
            // Replié, le formulaire ne pèse qu'une ligne — mais une ligne qui
            // dit clairement ce qu'elle ouvre.
            <button
              type="button"
              onClick={openForm}
              className="flex w-full items-center justify-between gap-5 border border-olive/40 bg-background px-6 py-5 text-left transition-colors hover:border-olive sm:px-8"
            >
              <span>
                <span className="font-serif text-[1.35rem] leading-snug font-light text-ink">
                  {c.formOpen}
                </span>
                <span className="mt-1 block max-w-xl text-[0.85rem] leading-relaxed text-muted-foreground">
                  {c.formOpenNote}
                </span>
              </span>
              <Plus className="size-5 shrink-0 text-olive" strokeWidth={1.2} />
            </button>
          )}
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
  todo,
  todoLabel,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: string;
  hint?: string;
  /** Champ indispensable resté vide : tout le bloc passe en terre cuite. */
  todo?: boolean;
  todoLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${todo ? "[&_input]:border-clay [&_select]:border-clay" : ""}`}>
      <span className={todo ? labelTodoClass : labelClass}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
        {optional ? (
          <span className="ml-2 font-sans text-[0.72rem] tracking-normal normal-case text-muted-foreground/70">
            ({optional})
          </span>
        ) : null}
        {todo && todoLabel ? (
          <span className="ml-2 border border-clay/40 bg-clay-soft px-1.5 py-0.5 text-[0.6rem] tracking-[0.12em] text-clay">
            {todoLabel}
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

/** Le nombre de places libres, lisible d'un coup d'œil. */
function Seats({ count, note }: { count: number; note?: string | undefined }) {
  const c = useT().covoiturage;
  const full = count <= 0;
  return (
    <span
      className={`inline-flex shrink-0 self-start items-center gap-1.5 px-2.5 py-1 font-display text-[0.68rem] tracking-[0.1em] uppercase ${
        full ? "border border-clay/50 bg-clay-soft text-clay" : "bg-olive text-primary-foreground"
      }`}
    >
      <Users className="size-3.5" strokeWidth={1.5} />
      {full ? c.seatsNone : `${count} ${count > 1 ? c.seatsMany : c.seatsOne}`}
      {note ? <span className="font-sans normal-case opacity-80">· {note}</span> : null}
    </span>
  );
}

/** Ce qu'un invité n'a pas encore renseigné, signalé en terre cuite. */
function Todo({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center border border-clay/40 bg-clay-soft px-2 py-0.5 font-display text-[0.62rem] tracking-[0.14em] uppercase text-clay">
      {label}
    </span>
  );
}

/** L'ossature commune à l'en-tête et aux lignes de la liste. */
const rowGrid = "grid gap-x-6 gap-y-3 sm:grid-cols-[minmax(0,1fr)_13rem_15rem_auto] sm:items-start";
const actionClass =
  "inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 px-3 py-2 font-display text-[0.68rem] tracking-[0.12em] whitespace-nowrap uppercase transition-colors";

/**
 * Un passager, en pastille. Un clic sur le nom le corrige, la croix le retire
 * — et rend sa place. Tout le monde peut le faire : c'est le principe de ce
 * tableau, et une coquille dans un prénom doit pouvoir se rattraper.
 */
function Passenger({
  name,
  onRename,
  onRemove,
}: {
  name: string;
  onRename: (to: string) => Promise<void>;
  onRemove: () => Promise<void>;
}) {
  const c = useT().covoiturage;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [busy, setBusy] = useState(false);
  // Cliquer la coche fait d'abord perdre le focus au champ. Si la sortie de
  // champ refermait le formulaire, le clic arriverait dans le vide — d'où un
  // enregistrement unique, déclenché par le premier des deux.
  const settled = useRef(false);

  async function commit() {
    if (settled.current) return;
    settled.current = true;
    const to = draft.trim();
    setEditing(false);
    if (!to || to === name) return;
    setBusy(true);
    await onRename(to);
    setBusy(false);
  }

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void commit();
        }}
        className="inline-flex items-center gap-1"
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => void commit()}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              settled.current = true;
              setEditing(false);
            }
          }}
          maxLength={80}
          autoFocus
          aria-label={c.passengerRename}
          className="min-h-8 w-28 border-b border-olive bg-transparent px-1 text-[0.8rem] text-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          aria-label={c.passengerSave}
          className="inline-flex min-h-8 items-center px-1 text-olive disabled:opacity-50"
        >
          <Check className="size-3.5" strokeWidth={1.6} />
        </button>
      </form>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 border border-border bg-sand/40 pl-2 text-[0.8rem] text-ink">
      <button
        type="button"
        onClick={() => {
          setDraft(name);
          settled.current = false;
          setEditing(true);
        }}
        title={c.passengerRename}
        className="min-h-8 transition-colors hover:text-olive"
      >
        {name}
      </button>
      <button
        type="button"
        onClick={() => void onRemove()}
        aria-label={`${c.passengerRemove} ${name}`}
        title={c.passengerRemove}
        className="inline-flex min-h-8 items-center px-1.5 text-muted-foreground transition-colors hover:text-clay"
      >
        <X className="size-3" strokeWidth={1.6} />
      </button>
    </span>
  );
}

/**
 * Un trajet, sur une ligne.
 *
 * On parcourt cette liste pour comparer des horaires et des places : les
 * mêmes données doivent donc tomber toujours au même endroit. D'où quatre
 * zones fixes — disponibilité, qui et par où, quand, comment joindre — qui
 * s'empilent sur téléphone et s'alignent dès l'écran large.
 */
function TripRow({
  trip,
  delay,
  active,
  onEdit,
  onRemove,
  onJoin,
  onPassenger,
}: {
  trip: Trip;
  delay: number;
  active: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onJoin: (name: string) => Promise<void>;
  onPassenger: (from: string, to: string | null) => Promise<void>;
}) {
  const t = useT();
  const lang = useLang();
  const c = t.covoiturage;
  const wa = trip.whatsapp ? whatsappHref(trip.phone) : null;
  const tel = `tel:${trip.phone.replace(/\s/g, "")}`;
  // Une suppression est irréversible et le bouton est petit : le premier clic
  // ne fait qu'armer le second.
  const [confirming, setConfirming] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinName, setJoinName] = useState("");
  const [busy, setBusy] = useState(false);
  const full = trip.seats <= 0;
  const people = (trip.passengers ?? "")
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);

  const line = (date: string | null, slot: number | null, suffix?: string) =>
    date
      ? `${dateLabel(date, lang, true)}${slot == null ? "" : ` · ${slotLabel(slot, lang)}`}${suffix ?? ""}`
      : null;

  return (
    <Reveal
      as="li"
      delay={delay}
      className={`${rowGrid} px-1 py-4 transition-colors duration-500 ${
        active ? "bg-sand/40" : "hover:bg-sand/20"
      }`}
    >
      <>
        {/* Reste-t-il de la place, et pour aller où. Le nom et la pastille
               partagent une ligne — sur un téléphone, chaque ligne économisée
               compte — et se replient si la largeur manque. */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="font-serif text-[1.15rem] leading-tight font-light text-ink">
              {trip.name}
            </p>
            <Seats count={trip.seats} />
          </div>
          <p className="mt-1 text-[0.85rem] leading-snug text-muted-foreground">
            {trip.origin}
            <span className="mx-1.5 text-olive">→</span>
            {trip.destination}
          </p>
          {people.length ? (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="font-display text-[0.6rem] tracking-[0.16em] uppercase text-olive">
                {c.passengers}
              </span>
              {people.map((who) => (
                <Passenger
                  key={who}
                  name={who}
                  onRename={(to) => onPassenger(who, to)}
                  onRemove={() => onPassenger(who, null)}
                />
              ))}
            </div>
          ) : null}
          {trip.comment ? (
            <p className="mt-1 text-[0.8rem] leading-snug text-muted-foreground italic">
              {trip.comment}
            </p>
          ) : null}
        </div>

        {/* Quand. */}
        <div className="text-[0.82rem] leading-snug text-muted-foreground">
          <p>
            <span className="mr-1.5 font-display text-[0.6rem] tracking-[0.16em] uppercase text-olive">
              {c.arrival}
            </span>
            {line(trip.arrival_date, trip.arrival_slot)}
          </p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5">
            <span className="font-display text-[0.6rem] tracking-[0.16em] uppercase text-olive">
              {c.departure}
            </span>
            {trip.departure_date ? (
              <>
                <span>
                  {line(
                    trip.departure_date,
                    trip.departure_slot,
                    trip.return_destination ? ` ${c.returnTo} ${trip.return_destination}` : "",
                  )}
                </span>
                {trip.seats_return == null ? null : (
                  <span className="text-olive">
                    · {trip.seats_return} {trip.seats_return > 1 ? c.seatsMany : c.seatsOne}
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="text-clay">{c.departureUnknown}</span>
                <Todo label={c.toComplete} />
              </>
            )}
          </p>
        </div>

        {/* 4. Comment le joindre. Le numéro en clair — personne ne devrait
               avoir à cliquer pour le lire. */}
        <div>
          <a
            href={tel}
            aria-label={`${c.call} ${trip.name}`}
            className="inline-flex items-center gap-1.5 font-display text-[0.9rem] tracking-[0.03em] text-ink underline decoration-olive/40 decoration-1 underline-offset-4 transition-colors hover:text-olive"
          >
            <Phone className="size-3.5 shrink-0 text-olive" strokeWidth={1.5} />
            {trip.phone}
          </a>

          {/* Monter dans la voiture. Le champ n'apparaît qu'au clic : une ligne
              n'a pas à porter un formulaire en permanence. */}
          <div className="mt-2 flex gap-2">
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noreferrer noopener"
                className={`${actionClass} bg-olive text-primary-foreground hover:bg-olive-deep`}
              >
                <MessageCircle className="size-3.5" strokeWidth={1.5} />
                {c.whatsapp}
              </a>
            ) : null}
            {joining ? null : (
              <button
                type="button"
                onClick={() => setJoining(true)}
                disabled={full}
                className={`${actionClass} border border-dashed border-olive/40 text-olive hover:bg-sage-soft/60 disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground/60`}
              >
                <UserPlus className="size-3.5" strokeWidth={1.5} />
                {full ? c.seatsNone : c.join}
              </button>
            )}
          </div>

          {joining ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!joinName.trim()) return;
                setBusy(true);
                await onJoin(joinName.trim());
                setBusy(false);
                setJoining(false);
                setJoinName("");
              }}
              className="mt-2 flex gap-2"
            >
              <input
                type="text"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                placeholder={c.joinName}
                maxLength={80}
                autoFocus
                className="min-h-11 min-w-0 flex-1 border-b border-border bg-transparent px-1 text-[0.85rem] text-ink placeholder:text-muted-foreground/55 focus:border-olive focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy}
                className={`${actionClass} flex-none border border-olive/40 px-3 text-ink hover:border-olive hover:text-olive disabled:opacity-50`}
              >
                {c.joinConfirm}
              </button>
            </form>
          ) : null}
        </div>

        {/* Corriger ou retirer : discret, en bout de ligne. */}
        <div className="flex items-center gap-3 font-display text-[0.62rem] tracking-[0.14em] uppercase sm:flex-col sm:items-end sm:gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex min-h-8 items-center gap-1.5 text-muted-foreground transition-colors hover:text-ink"
          >
            <Pencil className="size-3" strokeWidth={1.5} />
            {c.edit}
          </button>
          {confirming ? (
            <>
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex min-h-8 items-center text-clay transition-opacity hover:opacity-70"
              >
                {c.confirmRemove}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="inline-flex min-h-8 items-center text-muted-foreground transition-colors hover:text-ink"
              >
                {c.cancel}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="inline-flex min-h-8 items-center gap-1.5 text-muted-foreground transition-colors hover:text-clay"
            >
              <Trash2 className="size-3" strokeWidth={1.5} />
              {c.remove}
            </button>
          )}
        </div>
      </>
    </Reveal>
  );
}
