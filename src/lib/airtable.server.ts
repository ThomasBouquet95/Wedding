/**
 * Accès à Airtable, côté serveur uniquement.
 *
 * Airtable n'a pas d'équivalent de la clé « publishable » de Supabase : son
 * jeton d'accès ouvre la base en lecture comme en écriture, sans règle par
 * ligne pour le brider. L'inscrire dans le code du site — dépôt public, et
 * paquet servi à chaque visiteur — reviendrait à confier à n'importe qui le
 * droit de lire tous les numéros de téléphone des invités et de vider la base.
 *
 * `AIRTABLE_HOST` n'existe que pour les tests, qui font répondre un faux
 * Airtable local à la place du vrai.
 *
 * Le jeton vit donc dans une variable d'environnement Vercel *sans* préfixe
 * `VITE_`, ce qui la garde hors du paquet client, et ce module n'est importé
 * que depuis des fonctions serveur. Le navigateur passe par elles et ne voit
 * jamais le jeton.
 */
const TOKEN = process.env["AIRTABLE_TOKEN"] ?? "";
const BASE = process.env["AIRTABLE_BASE"] ?? "";

export const TABLE_COVOITURAGE = process.env["AIRTABLE_TABLE_COVOITURAGE"] || "Covoiturage";
export const TABLE_SEJOURS = process.env["AIRTABLE_TABLE_SEJOURS"] || "Sejours";

export const airtableReady = Boolean(TOKEN && BASE);

export type AirtableRecord<T> = { id: string; createdTime: string; fields: T };

async function call(path: string, init?: RequestInit): Promise<unknown> {
  if (!airtableReady) throw new Error("Airtable n'est pas configuré.");
  const host = process.env["AIRTABLE_HOST"] || "https://api.airtable.com";
  const response = await fetch(`${host}/v0/${BASE}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "content-type": "application/json",
      ...init?.headers,
    },
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Airtable ${response.status} : ${body}`);
  return body ? JSON.parse(body) : null;
}

/** Toutes les lignes d'une table, triées, pagination suivie jusqu'au bout. */
export async function listRows<T>(
  table: string,
  sort: { field: string; direction?: "asc" | "desc" }[] = [],
): Promise<AirtableRecord<T>[]> {
  const rows: AirtableRecord<T>[] = [];
  let offset: string | undefined;
  do {
    const params = new URLSearchParams({ pageSize: "100" });
    sort.forEach((s, i) => {
      params.set(`sort[${i}][field]`, s.field);
      params.set(`sort[${i}][direction]`, s.direction ?? "asc");
    });
    if (offset) params.set("offset", offset);
    const page = (await call(`${encodeURIComponent(table)}?${params}`)) as {
      records: AirtableRecord<T>[];
      offset?: string;
    };
    rows.push(...page.records);
    offset = page.offset;
    // Airtable pagine par cent ; la garde évite une boucle sans fin si l'API
    // renvoyait un curseur immobile.
  } while (offset && rows.length < 1000);
  return rows;
}

/**
 * La base peut être en retard d'une colonne sur le site — une migration
 * ajoutée ici mais pas encore posée là-bas. Airtable refuse alors toute
 * l'écriture, en nommant la colonne fautive dans son message. On la retire et
 * on réessaie : mieux vaut enregistrer un trajet sans son champ le plus récent
 * que de le perdre entièrement.
 */
function unknownField(message: string): string | null {
  const match = /Unknown field name(?:s)?: "?([^"\n]+)"?/i.exec(message);
  return match ? (match[1] ?? "").trim() : null;
}

async function write(
  path: string,
  method: "POST" | "PATCH",
  fields: Record<string, unknown>,
): Promise<void> {
  // `typecast` laisse Airtable convertir ce qui peut l'être — un texte vers une
  // date, un nombre vers un choix — plutôt que de refuser pour une question de
  // forme.
  const body = (f: Record<string, unknown>) => JSON.stringify({ fields: f, typecast: true });
  try {
    await call(path, { method, body: body(fields) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const missing = unknownField(message);
    if (!missing || !(missing in fields)) throw error;
    const { [missing]: _drop, ...rest } = fields;
    await call(path, { method, body: body(rest) });
  }
}

export async function createRow(table: string, fields: Record<string, unknown>): Promise<void> {
  await write(encodeURIComponent(table), "POST", fields);
}

export async function updateRow(
  table: string,
  id: string,
  fields: Record<string, unknown>,
): Promise<void> {
  await write(`${encodeURIComponent(table)}/${id}`, "PATCH", fields);
}

export async function deleteRow(table: string, id: string): Promise<void> {
  await call(`${encodeURIComponent(table)}/${id}`, { method: "DELETE" });
}
