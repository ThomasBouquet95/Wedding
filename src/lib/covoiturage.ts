import type { Lang } from "./i18n";
import { joinTripFn, listTripsFn, removeTripFn, saveTripFn } from "./covoiturage.server";

export type { Trip, TripInput } from "./covoiturage-types";
import type { Trip, TripInput } from "./covoiturage-types";

/**
 * Le tableau de covoiturage, vu du navigateur.
 *
 * Les quatre opérations passent par des fonctions serveur : Airtable n'a pas
 * de clé publique bridée par des règles par ligne, son jeton ouvre toute la
 * base. Il reste donc côté serveur — voir `airtable.server.ts`.
 */

export async function fetchTrips(): Promise<Trip[]> {
  return listTripsFn();
}

export async function createTrip(trip: TripInput): Promise<void> {
  await saveTripFn({ data: { id: null, trip } });
}

export async function updateTrip(id: string, trip: TripInput): Promise<void> {
  await saveTripFn({ data: { id, trip } });
}

export async function deleteTrip(id: string): Promise<void> {
  await removeTripFn({ data: { id } });
}

/** Monter dans une voiture : le nom rejoint la liste, une place libre part. */
export async function joinTrip(id: string, name: string): Promise<void> {
  await joinTripFn({ data: { id, name } });
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

/**
 * « samedi 26 juin » / « Saturday 26 June », ou sa forme abrégée
 * « sam. 26 juin » quand la place manque — dans la liste des trajets, chaque
 * ligne gagnée compte sur un téléphone.
 */
export function dateLabel(iso: string, lang: Lang, short = false): string {
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
    weekday: short ? "short" : "long",
    day: "numeric",
    month: short ? "short" : "long",
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

/**
 * Le récapitulatif de repli, proposé à la copie lorsque le tableau n'est pas
 * joignable : l'invité peut alors l'envoyer à Alexandra ou Thomas plutôt que
 * de perdre ce qu'il vient de saisir.
 */
export function tripSummary(trip: TripInput, lang: Lang): string {
  const l = lang === "fr";
  // Le français fait précéder le deux-points d'une espace insécable, pas
  // l'anglais.
  const s = l ? " : " : ": ";
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
