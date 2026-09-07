import { createServerFn } from "@tanstack/react-start";
import { TABLE_COVOITURAGE, TABLE_SEJOURS } from "./airtable.server";

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
type TableReport = { table: string; status: number; code: string; rows: number | null };

export const diagnoseFn = createServerFn({ method: "GET" }).handler(async () => {
  const token = process.env["AIRTABLE_TOKEN"] ?? "";
  const base = process.env["AIRTABLE_BASE"] ?? "";
  const host = process.env["AIRTABLE_HOST"] || "https://api.airtable.com";

  const report: TableReport[] = [];
  for (const table of [TABLE_COVOITURAGE, TABLE_SEJOURS]) {
    if (!token || !base) {
      report.push({ table, status: 0, code: "NON_CONFIGURE", rows: null });
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
      });
    } catch (error) {
      report.push({
        table,
        status: -1,
        code: error instanceof Error ? error.message.slice(0, 120) : "ECHEC_RESEAU",
        rows: null,
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
