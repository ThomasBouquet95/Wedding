/**
 * Accès direct à l'API REST du projet Supabase.
 *
 * Le site n'a besoin que de lire quelques lignes et d'en écrire : embarquer
 * `@supabase/supabase-js` coûterait une bonne centaine de kilo-octets
 * compressés et emporterait avec lui l'authentification, le stockage et le
 * temps réel, dont rien ici ne se sert.
 *
 * L'adresse et la clé sont inscrites dans le code plutôt que confiées aux
 * variables d'environnement de Vercel, qu'il faudrait redéfinir puis
 * redéployer à chaque changement. La clé est de type « publishable » : faite
 * pour être exposée, elle part de toute façon dans le paquet servi à chaque
 * visiteur, et ne donne accès qu'à ce que les règles RLS des tables
 * autorisent. Une variable d'environnement, si elle existe, reste prioritaire.
 */
const SUPABASE_URL = "https://arqifywkiigmhqayyizh.supabase.co";
const SUPABASE_KEY = "sb_publishable_DHKWxj6jNNOpbbEtkr4ZkA_78-SYQIK";

const REST_URL = import.meta.env["VITE_SUPABASE_URL"] || SUPABASE_URL;
const REST_KEY = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] || SUPABASE_KEY;

/** Vrai si le projet est renseigné à la compilation. */
export const configured = Boolean(REST_URL && REST_KEY);

export async function rest(table: string, path = "", init?: RequestInit): Promise<Response> {
  if (!configured) throw new Error("Supabase n'est pas configuré.");
  const response = await fetch(`${REST_URL}/rest/v1/${table}${path}`, {
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
 * La base peut être en retard d'une migration sur le site. Comme PostgREST
 * rejette tout envoi mentionnant une colonne absente, même à vide, on lui
 * demande ce qu'elle connaît avant de proposer le champ correspondant.
 */
export async function hasColumn(table: string, column: string): Promise<boolean> {
  try {
    await rest(table, `?select=${column}&limit=0`);
    return true;
  } catch {
    return false;
  }
}

/** Vrai si la table existe et se laisse lire. */
export async function hasTable(table: string): Promise<boolean> {
  try {
    await rest(table, "?select=id&limit=0");
    return true;
  } catch {
    return false;
  }
}
