import type { Database } from "@/integrations/supabase/types";
import type { Lang } from "./i18n";
import { hasColumn, rest } from "./supabase-rest";

export type Trip = Database["public"]["Tables"]["covoiturage"]["Row"];
export type TripInput = Database["public"]["Tables"]["covoiturage"]["Insert"];

/**
 * Les colonnes facultatives, ajoutées après coup. La base peut être en retard
 * d'une migration sur le site ; plutôt que de refuser les inscriptions —
 * PostgREST rejette tout envoi mentionnant une colonne absente, même à vide —
 * on demande à la base ce qu'elle connaît et on masque le reste.
 */
export type Extras = { returnDestination: boolean; returnSeats: boolean };

export const NO_EXTRAS: Extras = { returnDestination: false, returnSeats: false };

export async function probeExtras(): Promise<Extras> {
  const [returnDestination, returnSeats] = await Promise.all([
    hasColumn("covoiturage", "return_destination"),
    hasColumn("covoiturage", "seats_return"),
  ]);
  return { returnDestination, returnSeats };
}

/**
 * Les créneaux d'arrivée et de départ, par tranches de deux heures. On ne
 * stocke que l'heure de début : le libellé dépend de la langue, la donnée
 * non.
 */
export const SLOTS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22] as const;

export function slotLabel(start: number, lang: Lang): string {
  const end = start + 2;
  if (lang === "fr") {
    const h = (n: number) => (n === 24 ? "minuit" : `${String(n).padStart(2, "0")}h`);
    return `${h(start)} — ${h(end)}`;
  }
  const h = (n: number) => {
    if (n === 24) return "midnight";
    if (n === 0) return "12 am";
    if (n === 12) return "12 pm";
    return n < 12 ? `${n} am` : `${n - 12} pm`;
  };
  return `${h(start)} — ${h(end)}`;
}

/** « samedi 26 juin » / « Saturday 26 June ». */
export function dateLabel(iso: string, lang: Lang): string {
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/**
 * Un numéro saisi à la main arrive sous toutes les formes. WhatsApp attend
 * l'indicatif pays sans « + » ni séparateur ; un numéro français noté
 * « 06 12 … » est donc converti, et tout ce qui est déjà international est
 * conservé tel quel.
 */
export function whatsappHref(phone: string): string | null {
  const trimmed = phone.trim();
  let digits = trimmed.replace(/\D/g, "");
  if (!trimmed.startsWith("+")) {
    if (digits.startsWith("00")) digits = digits.slice(2);
    else if (digits.length === 10 && digits.startsWith("0")) digits = `33${digits.slice(1)}`;
  }
  return digits.length >= 8 && digits.length <= 15 ? `https://wa.me/${digits}` : null;
}

export async function fetchTrips(): Promise<Trip[]> {
  const response = await rest("covoiturage", "?select=*&order=arrival_date.asc,arrival_slot.asc");
  return (await response.json()) as Trip[];
}

export async function createTrip(trip: TripInput): Promise<void> {
  await rest("covoiturage", "", { method: "POST", body: JSON.stringify(trip) });
}

/**
 * Modification et suppression demandent `return=representation` : sans en-tête,
 * PostgREST répond « 204 » aussi bien quand la ligne a été touchée que quand
 * les règles RLS l'ont écartée. La liste renvoyée lève l'ambiguïté — vide,
 * c'est que rien n'a bougé.
 */
async function mutate(id: string, init: RequestInit): Promise<void> {
  const response = await rest("covoiturage", `?id=eq.${encodeURIComponent(id)}`, {
    ...init,
    headers: { Prefer: "return=representation", ...init.headers },
  });
  const rows = (await response.json()) as unknown[];
  if (rows.length === 0) throw new Error("Aucune ligne modifiée.");
}

export async function updateTrip(id: string, trip: TripInput): Promise<void> {
  await mutate(id, { method: "PATCH", body: JSON.stringify(trip) });
}

export async function deleteTrip(id: string): Promise<void> {
  await mutate(id, { method: "DELETE" });
}

/**
 * Le récapitulatif de repli, proposé à la copie lorsque le tableau n'est pas
 * joignable : l'invité peut alors l'envoyer à Alexandra ou Thomas plutôt que
 * de perdre ce qu'il vient de saisir.
 */
export function tripSummary(trip: TripInput, lang: Lang): string {
  const l = lang === "fr";
  // Le français fait précéder le deux-points d'une espace insécable, pas
  // l'anglais.
  const s = l ? " : " : ": ";
  const back = trip.departure_date
    ? `${dateLabel(trip.departure_date, lang)}${
        trip.departure_slot == null ? "" : `, ${slotLabel(trip.departure_slot, lang)}`
      }${trip.return_destination ? ` ${l ? "vers" : "to"} ${trip.return_destination}` : ""}`
    : l
      ? "non précisé"
      : "not yet decided";

  const lines = [
    `${l ? "Covoiturage" : "Ride-sharing"} — ${trip.name}`,
    `${l ? "Téléphone" : "Phone"}${s}${trip.phone}${trip.whatsapp ? " (WhatsApp)" : ""}`,
    `${l ? "Départ de" : "From"}${s}${trip.origin}`,
    `${l ? "Vers" : "To"}${s}${trip.destination}`,
    `${l ? "Arrivée" : "Arriving"}${s}${dateLabel(trip.arrival_date, lang)}, ${slotLabel(trip.arrival_slot, lang)}`,
    `${l ? "Retour" : "Heading back"}${s}${back}`,
    `${l ? "Places à l'aller" : "Seats on the way there"}${s}${trip.seats ?? 0}`,
  ];
  if (trip.seats_return != null)
    lines.push(`${l ? "Places au retour" : "Seats on the way back"}${s}${trip.seats_return}`);
  if (trip.comment) lines.push(`${l ? "Commentaire" : "Comment"}${s}${trip.comment}`);
  return lines.join("\n");
}
