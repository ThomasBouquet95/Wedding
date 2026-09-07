/**
 * Adresse publique du site, utilisée pour les balises Open Graph (og:url,
 * og:image) et les balises canoniques, qui exigent des URL absolues.
 *
 * Renseignée au build par `VITE_SITE_URL`, sans slash final, et en incluant le
 * sous-chemin si le site n'est pas servi à la racine.
 *
 * À défaut, le domaine définitif ci-dessous sert de valeur par défaut.
 *
 * Notation pointée et non crochets : voir `src/vite-env.d.ts`, la notation
 * crochets ferait entrer tout l'environnement `VITE_` dans le paquet client.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://alexandra-et-thomas.fr").replace(
  /\/+$/,
  "",
);

/** Image d'aperçu au partage — fichier statique dans /public. */
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
