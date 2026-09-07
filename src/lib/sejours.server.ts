import { createServerFn } from "@tanstack/react-start";
import { airtableReady, createRow, TABLE_SEJOURS } from "./airtable.server";

/**
 * Les fonctions serveur du sondage « où dormez-vous ? ».
 *
 * Comme pour le covoiturage, le jeton Airtable ne quitte pas le serveur. Ces
 * réponses ne sont d'ailleurs jamais relues par le site : elles ne servent
 * qu'à dimensionner les retours du samedi soir, et se consultent dans
 * Airtable.
 */
const F = { name: "Noms", accommodation: "Hébergement", people: "Personnes" } as const;

export const sejoursOpenFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<boolean> => airtableReady,
);

export const saveSejourFn = createServerFn({ method: "POST" })
  .validator((data: { name: string; accommodation: string; people: number }) => data)
  .handler(async ({ data }) => {
    await createRow(TABLE_SEJOURS, {
      [F.name]: data.name,
      [F.accommodation]: data.accommodation,
      [F.people]: data.people,
    });
  });
