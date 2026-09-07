import { createServerFn } from "@tanstack/react-start";
import { TABLE_COVOITURAGE, TABLE_SEJOURS } from "./airtable.server";
import { COVOITURAGE_FIELDS, SEJOURS_FIELDS } from "./airtable-schema";

/**
 * Un bilan de santé de la liaison Airtable.
 *
 * Quand une fonction serveur échoue, l'intercepteur d'erreurs du site renvoie
 * une page générique et le détail ne vit plus que dans les journaux Vercel.
 * Cette fonction-ci répond en clair : les variables sont-elles renseignées, et
 * qu'a répondu Airtable pour chaque table.
 *
 * Elle ne divulgue rien de sensible — jamais le jeton, seulement s'il est
 * défini, plus le code d'erreur d'Airtable. L'identifiant de base n'est pas un
 * secret : il figure dans l'URL du navigateur, et ne sert à rien sans jeton.
 */
type TableReport = {
  table: string;
  status: number;
  code: string;
  rows: number | null;
  /** Colonnes attendues par le site et absentes de la table. */
  missing: string[];
};

export const diagnoseFn = createServerFn({ method: "GET" }).handler(async () => {
  const token = process.env["AIRTABLE_TOKEN"] ?? "";
  const base = process.env["AIRTABLE_BASE"] ?? "";
  const host = process.env["AIRTABLE_HOST"] || "https://api.airtable.com";

  // Les colonnes réellement présentes, si le jeton peut lire le schéma. Sans
  // cette lecture, une colonne manquante ne se manifeste que par une donnée
  // qui disparaît en silence — c'est ce qui est arrivé aux passagers.
  const columns = new Map<string, Set<string>>();
  if (token && base) {
    try {
      const meta = await fetch(`${host}/v0/meta/bases/${base}/tables`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (meta.ok) {
        const body = (await meta.json()) as {
          tables?: { name: string; fields: { name: string }[] }[];
        };
        for (const t of body.tables ?? [])
          columns.set(t.name, new Set((t.fields ?? []).map((f) => f.name)));
      }
    } catch {
      /* le diagnostic se contentera de ne rien dire des colonnes */
    }
  }

  const attendu = new Map<string, string[]>([
    [TABLE_COVOITURAGE, COVOITURAGE_FIELDS.map((f) => f.name)],
    [TABLE_SEJOURS, SEJOURS_FIELDS.map((f) => f.name)],
  ]);

  const report: TableReport[] = [];
  for (const table of [TABLE_COVOITURAGE, TABLE_SEJOURS]) {
    const present = columns.get(table);
    const missing = present ? (attendu.get(table) ?? []).filter((name) => !present.has(name)) : [];
    if (!token || !base) {
      report.push({ table, status: 0, code: "NON_CONFIGURE", rows: null, missing });
      continue;
    }
    try {
      const response = await fetch(`${host}/v0/${base}/${encodeURIComponent(table)}?pageSize=1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = (await response.json()) as {
        records?: unknown[];
        error?: { type?: string } | string;
      };
      const code =
        typeof body.error === "string"
          ? body.error
          : (body.error?.type ?? (response.ok ? "OK" : "ERREUR"));
      report.push({
        table,
        status: response.status,
        code,
        rows: body.records ? body.records.length : null,
        missing,
      });
    } catch (error) {
      report.push({
        table,
        status: -1,
        code: error instanceof Error ? error.message.slice(0, 120) : "ECHEC_RESEAU",
        rows: null,
        missing,
      });
    }
  }

  return {
    tokenDefini: Boolean(token),
    tokenLongueur: token.length,
    baseDefinie: Boolean(base),
    base,
    tables: report,
  };
});
