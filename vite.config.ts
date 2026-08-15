// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Build statique pour GitHub Pages : `STATIC_BUILD=true npm run build` écrit
// dans `dist/client/` un dossier de fichiers HTML/CSS/JS servable tel quel,
// une page HTML complète par route. Sans cette variable, le build reste celui
// d'origine (SSR via Nitro, cf. DEPLOIEMENT-VERCEL.md).
const isStaticBuild = process.env["STATIC_BUILD"] === "true";

// GitHub Pages sert le site sous `/<nom-du-dépôt>/` tant qu'aucun domaine
// personnalisé n'est branché. Le workflow renseigne BASE_PATH en conséquence ;
// avec un domaine personnalisé (site servi à la racine), laisser vide.
const basePath = process.env["BASE_PATH"] || "/";

export default defineConfig({
  vite: {
    base: basePath,
    // Le prérendu démarre un `vite preview` interne et le crawle. Le forcer sur
    // l'IPv4 loopback : certains environnements de build n'ont pas d'IPv6, et
    // l'écoute par défaut sur `::` y échoue avec EAFNOSUPPORT.
    preview: { host: "127.0.0.1" },
  },
  // Le site statique n'a pas de serveur : on court-circuite Nitro, dont la
  // sortie `.output/` entre en conflit avec le serveur de prévisualisation
  // utilisé par le prérendu. Vite écrit alors dans `dist/client/`.
  ...(isStaticBuild ? { nitro: false as const } : {}),
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(isStaticBuild
      ? {
          // Chaque route est rendue en HTML au moment du build. `crawlLinks`
          // suit les liens internes depuis "/" et découvre le reste du site.
          pages: [{ path: "/" }],
          prerender: {
            enabled: true,
            crawlLinks: true,
            failOnError: true,
          },
        }
      : {}),
  },
});
