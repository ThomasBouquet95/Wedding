import { createServerFn } from "@tanstack/react-start";
import { TABLE_COVOITURAGE, TABLE_SEJOURS } from "./airtable.server";

/**
 * Création des deux tables Airtable, déclenchée depuis la page de diagnostic.
 *
 * Les créer à la main est fastidieux et fragile : seize colonnes dont les noms
 * doivent correspondre au caractère près, accents et majuscules compris. Le
 * site, lui, détient déjà le jeton — il est donc mieux placé que quiconque
 * pour poser exactement le schéma qu'il attend.
 *
 * L'opération passe par l'API de métadonnées d'Airtable, qui exige du jeton la
 * permission `schema.bases:write` en plus de `data.records:read` et
 * `data.records:write`. À défaut, Airtable refuse et le message le dit.
 *
 * Relancer l'opération ne casse rien : une table déjà présente est signalée
 * comme telle et laissée intacte.
 */
type Field = { name: string; type: string; options?: Record<string, unknown> };

const DATE_ISO = { dateFormat: { name: "iso" } };
const ENTIER = { precision: 0 };
const CASE = { icon: "check", color: "greenBright" };

const COVOITURAGE: Field[] = [
  { name: "Nom", type: "singleLineText" },
  { name: "Téléphone", type: "singleLineText" },
  { name: "WhatsApp", type: "checkbox", options: CASE },
  { name: "Départ", type: "singleLineText" },
  { name: "Destination", type: "singleLineText" },
  { name: "Date d'arrivée", type: "date", options: DATE_ISO },
  { name: "Heure d'arrivée", type: "number", options: ENTIER },
  { name: "Date de départ", type: "date", options: DATE_ISO },
  { name: "Heure de départ", type: "number", options: ENTIER },
  { name: "Retour vers", type: "singleLineText" },
  { name: "Places aller", type: "number", options: ENTIER },
  { name: "Places retour", type: "number", options: ENTIER },
  { name: "Commentaire", type: "multilineText" },
];

const SEJOURS: Field[] = [
  { name: "Noms", type: "singleLineText" },
  { name: "Hébergement", type: "singleLineText" },
  { name: "Personnes", type: "number", options: ENTIER },
];

type Result = { table: string; état: "créée" | "existait déjà" | "échec"; detail: string };

/** Type de retour explicite : sans lui, TypeScript figerait chaque message en
 *  littéral et la page de diagnostic ne pourrait plus en afficher d'autre. */
export type SetupReport = { ok: boolean; message: string; results: Result[] };

export const setupTablesFn = createServerFn({ method: "POST" }).handler(
  async (): Promise<SetupReport> => {
    const token = process.env["AIRTABLE_TOKEN"] ?? "";
    const base = process.env["AIRTABLE_BASE"] ?? "";
    const host = process.env["AIRTABLE_HOST"] || "https://api.airtable.com";

    if (!token || !base) {
      return {
        ok: false,
        message: "AIRTABLE_TOKEN ou AIRTABLE_BASE manque dans les variables Vercel.",
        results: [],
      };
    }

    const headers = { Authorization: `Bearer ${token}`, "content-type": "application/json" };

    // Ce qui existe déjà, pour ne rien écraser.
    let existing: string[] = [];
    const listed = await fetch(`${host}/v0/meta/bases/${base}/tables`, { headers });
    if (listed.ok) {
      const body = (await listed.json()) as { tables?: { name: string }[] };
      existing = (body.tables ?? []).map((t) => t.name);
    } else {
      const text = await listed.text();
      return {
        ok: false,
        message:
          listed.status === 403
            ? "Le jeton n'a pas la permission « schema.bases:write » (ou ne couvre pas cette base). Ajoutez-la sur la page des jetons Airtable, puis réessayez."
            : `Airtable a refusé la lecture du schéma : ${listed.status} ${text.slice(0, 200)}`,
        results: [],
      };
    }

    const results: Result[] = [];
    for (const [name, fields] of [
      [TABLE_COVOITURAGE, COVOITURAGE],
      [TABLE_SEJOURS, SEJOURS],
    ] as const) {
      if (existing.includes(name)) {
        results.push({ table: name, état: "existait déjà", detail: "laissée intacte" });
        continue;
      }
      const response = await fetch(`${host}/v0/meta/bases/${base}/tables`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name, fields }),
      });
      if (response.ok) {
        results.push({ table: name, état: "créée", detail: `${fields.length} colonnes` });
      } else {
        const text = await response.text();
        results.push({
          table: name,
          état: "échec",
          detail: `${response.status} ${text.slice(0, 200)}`,
        });
      }
    }

    const ok = results.every((r) => r.état !== "échec");
    return {
      ok,
      message: ok
        ? "Les tables sont en place. Rechargez cette page pour voir le diagnostic passer au vert."
        : "Une table n'a pas pu être créée — voir le détail ci-dessous.",
      results,
    };
  },
);
