import { useEffect, useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useT } from "@/lib/i18n";
import {
  accommodationChoices,
  alreadyAnswered,
  countVisit,
  createSejour,
  OTHER,
  remember,
  sejoursOpen,
  THRESHOLD,
  UNKNOWN,
} from "@/lib/sejours";

/**
 * « Où dormez-vous ? », posé une fois, au bout de quelques pages.
 *
 * Le samedi soir, un retour est organisé vers les hébergements les plus
 * proches : le dimensionner suppose de savoir qui dort où. La question arrive
 * donc après {@link THRESHOLD} pages consultées plutôt qu'à la première
 * seconde — le temps que l'invité ait trouvé ce qu'il cherchait — et ne
 * revient plus, qu'il ait répondu ou refermé.
 */
export function SejourInvite() {
  const t = useT();
  const c = t.sejour;
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [choice, setChoice] = useState("");
  const [other, setOther] = useState("");
  const [people, setPeople] = useState("2");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "invalid" | "failed">("idle");
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  // Une page consultée, pas un rendu : sans ce garde-fou, un simple
  // changement de langue compterait pour une visite de plus.
  const counted = useRef<string | null>(null);

  useEffect(() => {
    if (alreadyAnswered() || open) return;
    if (counted.current === location.pathname) return;
    counted.current = location.pathname;
    if (countVisit() < THRESHOLD) return;
    // On ne dérange personne si la table n'existe pas encore : la réponse
    // n'irait nulle part.
    let alive = true;
    sejoursOpen().then((ok) => ok && alive && setOpen(true));
    return () => {
      alive = false;
    };
  }, [location.pathname, open]);

  // Échap referme, et le fond de page ne défile plus derrière la fenêtre.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  function dismiss() {
    remember("refuse");
    setOpen(false);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const accommodation = choice === OTHER ? other.trim() : choice === UNKNOWN ? c.unknown : choice;
    if (!name.trim() || !accommodation) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      await createSejour({
        name: name.trim(),
        accommodation,
        people: Number(people),
      });
      remember("envoye");
      setStatus("done");
      // Le temps de lire le remerciement avant que la fenêtre s'efface.
      setTimeout(() => setOpen(false), 1800);
    } catch {
      setStatus("failed");
    }
  }

  if (!open) return null;

  const label = "font-display text-[0.68rem] tracking-[0.22em] uppercase text-olive";
  const field =
    "mt-2 min-h-11 w-full border-0 border-b border-border bg-transparent py-2.5 text-[0.95rem] text-ink placeholder:text-muted-foreground/55 focus:border-olive focus:outline-none";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/45 p-0 sm:items-center sm:p-6"
      onClick={(e) => e.target === e.currentTarget && dismiss()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sejour-titre"
        className="max-h-[92svh] w-full max-w-lg overflow-y-auto border-t border-border bg-background px-6 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:border sm:px-10 sm:py-10"
      >
        <div className="flex items-start justify-between gap-6">
          <p className="eyebrow">{c.eyebrow}</p>
          <button
            type="button"
            onClick={dismiss}
            aria-label={c.close}
            className="-mt-2 -mr-2 inline-flex size-11 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-ink"
          >
            <X className="size-4" strokeWidth={1.4} />
          </button>
        </div>

        <h2
          id="sejour-titre"
          className="mt-4 font-serif text-[1.7rem] leading-snug font-light text-ink"
        >
          {c.heading}
        </h2>

        {status === "done" ? (
          <p className="mt-5 text-[0.95rem] leading-relaxed text-ink">{c.done}</p>
        ) : (
          <>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-muted-foreground">{c.text}</p>

            <form onSubmit={submit} className="mt-7 space-y-6" noValidate>
              <label className="block">
                <span className={label}>{c.name}</span>
                <input
                  ref={firstFieldRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  maxLength={120}
                  placeholder={c.namePlaceholder}
                  className={field}
                />
              </label>

              <label className="block">
                <span className={label}>{c.accommodation}</span>
                <select
                  value={choice}
                  onChange={(e) => setChoice(e.target.value)}
                  className={field}
                >
                  <option value="">— {c.choose} —</option>
                  {accommodationChoices.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                  <option value={OTHER}>{c.other}</option>
                  <option value={UNKNOWN}>{c.unknown}</option>
                </select>
              </label>

              {choice === OTHER ? (
                <label className="block">
                  <span className="sr-only">{c.other}</span>
                  <input
                    type="text"
                    value={other}
                    onChange={(e) => setOther(e.target.value)}
                    maxLength={160}
                    placeholder={c.otherPlaceholder}
                    className={field}
                  />
                </label>
              ) : null}

              <label className="block">
                <span className={label}>{c.people}</span>
                <select
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  className={field}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>

              <p className="text-[0.8rem] leading-relaxed text-muted-foreground">{c.privacy}</p>

              {status === "invalid" || status === "failed" ? (
                <p
                  role="alert"
                  className="border-l-2 border-clay bg-clay-soft px-4 py-3 text-[0.86rem] text-clay"
                >
                  {status === "invalid" ? c.invalid : c.failed}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex min-h-11 flex-1 items-center justify-center border border-olive/50 px-6 py-3 font-display text-[0.72rem] tracking-[0.2em] uppercase text-ink transition-colors hover:bg-olive hover:text-primary-foreground disabled:opacity-50 sm:flex-none"
                >
                  {status === "sending" ? c.sending : c.submit}
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  className="inline-flex min-h-11 items-center px-2 font-display text-[0.72rem] tracking-[0.16em] uppercase text-muted-foreground transition-colors hover:text-ink"
                >
                  {c.later}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
