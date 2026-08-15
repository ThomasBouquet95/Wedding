import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  retainSearchParams,
  stripSearchParams,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_URL, OG_IMAGE } from "@/lib/site";
import { useLang, useT, type Lang } from "@/lib/i18n";

function NotFoundComponent() {
  const t = useT();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="eyebrow">{t.errors.notFoundEyebrow}</p>
        <h1 className="mt-6 display-lg text-ink">{t.errors.notFoundTitle}</h1>
        <p className="mt-5 text-[0.95rem] leading-relaxed text-muted-foreground">
          {t.errors.notFoundText}
        </p>
        <div className="mt-9">
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-olive/50 px-8 py-3.5 label-xs text-ink transition-colors hover:bg-olive hover:text-primary-foreground"
          >
            {t.errors.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const t = useT();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="eyebrow">{t.errors.errorEyebrow}</p>
        <h1 className="mt-6 display-lg text-ink">{t.errors.errorTitle}</h1>
        <p className="mt-5 text-[0.95rem] leading-relaxed text-muted-foreground">
          {t.errors.errorText}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="border border-olive/50 px-8 py-3.5 label-xs text-ink transition-colors hover:bg-olive hover:text-primary-foreground"
          >
            {t.errors.retry}
          </button>
          {/* Lien brut (rechargement complet) plutôt que <Link> : le routeur
              vient d'échouer. `BASE_URL` tient compte du sous-chemin de
              déploiement lorsque le site n'est pas servi à la racine. */}
          <a
            href={import.meta.env.BASE_URL}
            className="border border-border px-8 py-3.5 label-xs text-ink transition-colors hover:bg-secondary"
          >
            {t.errors.backHome}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // La langue est toujours renseignée à l'exécution — toute valeur inconnue
  // retombe sur le français — mais déclarée facultative : la rendre
  // obligatoire forcerait chaque `<Link>` du site à la transporter à la main.
  validateSearch: (search: Record<string, unknown>): { lang?: Lang } => ({
    lang: search["lang"] === "en" ? "en" : "fr",
  }),
  search: {
    middlewares: [
      // `?lang=en` doit survivre au passage d'une page à l'autre, sans quoi
      // chaque navigation repartirait en français.
      retainSearchParams(["lang"]),
      // Le français étant la valeur par défaut, `?lang=fr` n'apparaît jamais
      // dans l'URL. Ce retrait est explicite, donc `retainSearchParams` ne le
      // réintroduit pas : c'est ce qui permet de revenir au français.
      stripSearchParams({ lang: "fr" as Lang }),
    ],
  },
  head: ({ match }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title:
          match.search.lang === "en"
            ? "Alexandra & Thomas — 25–26 June 2027, Provence"
            : "Alexandra & Thomas — 25-26 juin 2027, Provence",
      },
      {
        name: "description",
        content:
          "Informations pratiques du mariage d'Alexandra & Thomas au Couvent Notre-Dame des Prés, Reillanne.",
      },
      { name: "author", content: "Alexandra & Thomas" },
      { property: "og:site_name", content: "Alexandra & Thomas" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:title", content: "Alexandra & Thomas — 25-26 juin 2027" },
      {
        property: "og:description",
        content:
          "Informations pratiques du mariage d'Alexandra & Thomas au Couvent Notre-Dame des Prés, Reillanne.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL + "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Alexandra & Thomas — 25-26 juin 2027" },
      {
        name: "twitter:description",
        content:
          "Informations pratiques du mariage d'Alexandra & Thomas au Couvent Notre-Dame des Prés, Reillanne.",
      },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Le Couvent Notre-Dame des Prés à Reillanne, en Provence",
      },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&family=Karla:wght@300;400;500&display=swap",
      },
      // `BASE_URL` vaut "/" à la racine : le favicon suit le sous-chemin sur
      // lequel le site est servi.
      { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.ico`, type: "image/x-icon" },
      { rel: "alternate", hrefLang: "fr", href: SITE_URL + "/" },
      { rel: "alternate", hrefLang: "en", href: SITE_URL + "/?lang=en" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const lang = useLang();

  return (
    <html lang={lang}>
      <head>
        <HeadContent />
        {/* Sans JavaScript, les blocs .reveal resteraient à opacity:0. */}
        <noscript>
          <style>{".reveal{opacity:1;transform:none}"}</style>
        </noscript>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteHeader />
      <main id="contenu">
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      <SiteFooter />
    </QueryClientProvider>
  );
}
