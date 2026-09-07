/// <reference types="vite/client" />

/**
 * Les variables d'environnement exposées au navigateur, déclarées une par une.
 *
 * Sans cette déclaration, TypeScript refuse `import.meta.env.VITE_SITE_URL`
 * (TS4111, accès à une signature d'index) et pousse vers la notation
 * crochets — or Vite ne sait alors plus quelle variable remplacer et injecte
 * l'objet d'environnement *entier* dans le paquet client, avec toutes les
 * variables `VITE_` du `.env`. C'est ainsi qu'une ancienne clé Supabase s'est
 * retrouvée servie à chaque visiteur. La notation pointée, elle, ne remplace
 * que ce qui est écrit.
 */
interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
