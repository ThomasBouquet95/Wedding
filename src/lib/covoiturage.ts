import type { Database } from "@/integrations/supabase/types";
import type { Lang } from "./i18n";

export type Trip = Database["public"]["Tables"]["covoiturage"]["Row"];
export type TripInput = Database["public"]["Tables"]["covoiturage"]["Insert"];

/**
 * Le tableau n'a besoin que de deux requêtes — lire la liste, ajouter une
 * ligne — et l'API REST de Supabase les accepte en HTTP simple. On s'adresse
 * donc directement à elle plutôt que d'embarquer `@supabase/supabase-js`, qui
 * pèse une bonne centaine de kilo-octets compressés et emporte avec lui
 * l'authentification, le stockage et le temps réel, dont le site ne se sert
 * nulle part.
 */
/**
 * Le projet Supabase du site. Les deux valeurs sont inscrites ici plutôt que
 * confiées aux variables d'environnement de Vercel, qu'il faudrait redéfinir à
 * chaque déploiement. La clé est de type « publishable » : elle est faite pour
 * être exposée, part de toute façon dans le navigateur de chaque visiteur, et
 * ne donne que ce que les règles RLS de la table autorisent — lire le tableau
 * et y ajouter un trajet, rien d'autre. Une variable d'environnement, si elle
 * est définie, reste prioritaire.
 */
const SUPABASE_URL = "https://arqifywkiigmhqayyizh.supabase.co";
const SUPABASE_KEY = "sb_publishable_DHKWxj6jNNOpbbEtkr4ZkA_78-SYQIK";

const REST_URL = import.meta.env["VITE_SUPABASE_URL"] || SUPABASE_URL;
const REST_KEY = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] || SUPABASE_KEY;

/** Vrai si le projet Supabase est renseigné à la compilation. */
export const boardConfigured = Boolean(REST_URL && REST_KEY);

async function rest(path: string, init?: RequestInit): Promise<Response> {
  if (!boardConfigured) throw new Error("Supabase n'est pas configuré.");
  const response = await fetch(`${REST_URL}/rest/v1/covoiturage${path}`, {
    ...init,
    headers: {
      apikey: REST_KEY,
      "content-type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
  return response;
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
  const response = await rest("?select=*&order=arrival_date.asc,arrival_slot.asc");
  return (await response.json()) as Trip[];
}

export async function createTrip(trip: TripInput): Promise<void> {
  await rest("", { method: "POST", body: JSON.stringify(trip) });
}

/**
 * Modification et suppression demandent `return=representation` : sans en-tête,
 * PostgREST répond « 204 » aussi bien quand la ligne a été touchée que quand
 * les règles RLS l'ont écartée. La liste renvoyée lève l'ambiguïté — vide,
 * c'est que rien n'a bougé.
 */
async function mutate(id: string, init: RequestInit): Promise<void> {
  const response = await rest(`?id=eq.${encodeURIComponent(id)}`, {
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
    `${l ? "Places libres" : "Free seats"}${s}${trip.seats ?? 0}`,
  ];
  if (trip.comment) lines.push(`${l ? "Commentaire" : "Comment"}${s}${trip.comment}`);
  return lines.join("\n");
}
