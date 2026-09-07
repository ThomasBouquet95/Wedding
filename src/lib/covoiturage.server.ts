import { createServerFn } from "@tanstack/react-start";
import { createRow, deleteRow, listRows, TABLE_COVOITURAGE, updateRow } from "./airtable.server";
import type { Trip, TripInput } from "./covoiturage-types";

/**
 * Les fonctions serveur du tableau de covoiturage.
 *
 * Le navigateur les appelle ; elles seules parlent à Airtable. Le jeton reste
 * ainsi hors du paquet client — voir `airtable.server.ts`.
 */

/** Les colonnes de la table Airtable, telles que les mariés les voient. */
const F = {
  name: "Nom",
  phone: "Téléphone",
  whatsapp: "WhatsApp",
  origin: "Départ",
  destination: "Destination",
  arrivalDate: "Date d'arrivée",
  arrivalSlot: "Heure d'arrivée",
  departureDate: "Date de départ",
  departureSlot: "Heure de départ",
  returnDestination: "Retour vers",
  seats: "Places aller",
  seatsReturn: "Places retour",
  comment: "Commentaire",
  passengers: "Passagers",
} as const;

type Fields = Partial<Record<(typeof F)[keyof typeof F], unknown>>;

const text = (v: unknown): string => (typeof v === "string" ? v : "");
const num = (v: unknown): number | null => (typeof v === "number" ? v : null);

function toTrip(row: { id: string; fields: Fields }): Trip {
  return {
    id: row.id,
    name: text(row.fields[F.name]),
    phone: text(row.fields[F.phone]),
    whatsapp: row.fields[F.whatsapp] === true,
    origin: text(row.fields[F.origin]),
    destination: text(row.fields[F.destination]),
    arrival_date: text(row.fields[F.arrivalDate]),
    arrival_slot: num(row.fields[F.arrivalSlot]) ?? 16,
    departure_date: text(row.fields[F.departureDate]) || null,
    departure_slot: num(row.fields[F.departureSlot]),
    return_destination: text(row.fields[F.returnDestination]) || null,
    seats: num(row.fields[F.seats]) ?? 0,
    seats_return: num(row.fields[F.seatsReturn]),
    comment: text(row.fields[F.comment]) || null,
    passengers: text(row.fields[F.passengers]) || null,
  };
}

/** Airtable refuse une chaîne vide sur un champ date : on envoie `null`. */
function toFields(trip: TripInput): Record<string, unknown> {
  return {
    [F.name]: trip.name,
    [F.phone]: trip.phone,
    [F.whatsapp]: trip.whatsapp,
    [F.origin]: trip.origin,
    [F.destination]: trip.destination,
    [F.arrivalDate]: trip.arrival_date,
    [F.arrivalSlot]: trip.arrival_slot,
    [F.departureDate]: trip.departure_date || null,
    [F.departureSlot]: trip.departure_slot,
    [F.returnDestination]: trip.return_destination || null,
    [F.seats]: trip.seats,
    [F.seatsReturn]: trip.seats_return,
    [F.comment]: trip.comment || null,
    [F.passengers]: trip.passengers || null,
  };
}

export const listTripsFn = createServerFn({ method: "GET" }).handler(async (): Promise<Trip[]> => {
  const rows = await listRows<Fields>(TABLE_COVOITURAGE, [
    { field: F.arrivalDate },
    { field: F.arrivalSlot },
  ]);
  return rows.map(toTrip);
});

export const saveTripFn = createServerFn({ method: "POST" })
  .validator((data: { id: string | null; trip: TripInput }) => data)
  .handler(async ({ data }) => {
    if (data.id) await updateRow(TABLE_COVOITURAGE, data.id, toFields(data.trip));
    else await createRow(TABLE_COVOITURAGE, toFields(data.trip));
  });

/**
 * Monter dans une voiture : le nom s'ajoute à la liste des passagers et une
 * place libre disparaît. La lecture précède l'écriture — deux invités peuvent
 * cliquer à quelques secondes d'intervalle, et il faut partir de l'état réel
 * plutôt que de celui affiché par leur navigateur.
 */
export const joinTripFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; name: string }) => data)
  .handler(async ({ data }) => {
    const rows = await listRows<Fields>(TABLE_COVOITURAGE);
    const row = rows.find((r) => r.id === data.id);
    if (!row) throw new Error("Ce trajet n'existe plus.");

    const seats = num(row.fields[F.seats]) ?? 0;
    if (seats <= 0) throw new Error("Cette voiture est complète.");

    const already = text(row.fields[F.passengers]);
    const name = data.name.trim();
    const list = already
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    if (!list.some((n) => n.toLowerCase() === name.toLowerCase())) list.push(name);

    await updateRow(TABLE_COVOITURAGE, data.id, {
      [F.passengers]: list.join(", "),
      [F.seats]: Math.max(0, seats - 1),
    });
  });

export const removeTripFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await deleteRow(TABLE_COVOITURAGE, data.id);
  });
