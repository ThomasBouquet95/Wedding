import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

// `attachSupabaseAuth` était enregistré ici par l'échafaudage du projet. Il
// attache un jeton d'authentification aux appels de fonctions serveur — or le
// site n'en compte aucune et n'a pas de connexion. Son seul effet était de
// faire entrer `@supabase/supabase-js` dans le paquet envoyé au navigateur, à
// chaque page et sur chaque téléphone. Le tableau de covoiturage interroge
// l'API REST directement, il n'en a pas besoin non plus.
export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, csrfMiddleware],
}));
