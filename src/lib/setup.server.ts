import { createServerFn } from "@tanstack/react-start";
import { TABLE_COVOITURAGE, TABLE_SEJOURS } from "./airtable.server";
import { COVOITURAGE_FIELDS, SEJOURS_FIELDS } from "./airtable-schema";

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
 * Relancer l'opération ne casse rien : une table déjà présente n'est jamais
 * refaite, seules ses colonnes manquantes sont ajoutées. C'est ce qui permet
 * de suivre un champ nouvellement introduit dans le site sans repartir de
 * zéro, et sans toucher aux lignes déjà saisies.
 */

type Result = {
  table: string;
  état: "créée" | "complétée" | "à jour" | "échec";
  detail: string;
};

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
    type Existing = { id: string; name: string; fields: { name: string }[] };
    let existing: Existing[] = [];
    const listed = await fetch(`${host}/v0/meta/bases/${base}/tables`, { headers });
    if (listed.ok) {
      const body = (await listed.json()) as { tables?: Existing[] };
      existing = body.tables ?? [];
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
      [TABLE_COVOITURAGE, COVOITURAGE_FIELDS],
      [TABLE_SEJOURS, SEJOURS_FIELDS],
    ] as const) {
      const table = existing.find((t) => t.name === name);

      // Table absente : on la crée d'un bloc.
      if (!table) {
        const response = await fetch(`${host}/v0/meta/bases/${base}/tables`, {
          method: "POST",
          headers,
          body: JSON.stringify({ name, fields }),
        });
        const detail = response.ok
          ? `${fields.length} colonnes`
          : `${response.status} ${(await response.text()).slice(0, 200)}`;
        results.push({ table: name, état: response.ok ? "créée" : "échec", detail });
        continue;
      }

      // Table présente : on n'y ajoute que les colonnes manquantes. Une table
      // créée avant l'arrivée d'un nouveau champ se met ainsi à jour sans être
      // refaite, et rien de ce qu'elle contient n'est touché.
      const present = new Set(table.fields.map((f) => f.name));
      const missing = fields.filter((f) => !present.has(f.name));
      if (missing.length === 0) {
        results.push({ table: name, état: "à jour", detail: `${fields.length} colonnes` });
        continue;
      }
      const added: string[] = [];
      const failed: string[] = [];
      for (const field of missing) {
        const response = await fetch(`${host}/v0/meta/bases/${base}/tables/${table.id}/fields`, {
          method: "POST",
          headers,
          body: JSON.stringify(field),
        });
        if (response.ok) added.push(field.name);
        else failed.push(`${field.name} (${response.status})`);
      }
      results.push({
        table: name,
        état: failed.length ? "échec" : "complétée",
        detail: failed.length
          ? `ajoutées : ${added.join(", ") || "aucune"} — en échec : ${failed.join(", ")}`
          : `colonnes ajoutées : ${added.join(", ")}`,
      });
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
