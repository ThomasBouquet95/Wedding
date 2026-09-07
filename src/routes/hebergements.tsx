import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import couloir from "@/assets/couloir.webp";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";
import { translations, useT } from "@/lib/i18n";
import { stays } from "@/lib/hebergements";

export const Route = createFileRoute("/hebergements")({
  head: ({ match }) => {
    const p = translations[match.search.lang === "en" ? "en" : "fr"].hebergements;
    // La version dans l'autre langue est déclarée en `alternate` : sans quoi
    // les moteurs traiteraient les deux URL comme du contenu dupliqué.
    const canonical =
      match.search.lang === "en" ? SITE_URL + "/hebergements?lang=en" : SITE_URL + "/hebergements";

    return {
      meta: [
        { title: p.title },
        { name: "description", content: p.description },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.description },
        { property: "og:url", content: canonical },
        { property: "og:locale", content: match.search.lang === "en" ? "en_GB" : "fr_FR" },
      ],
      links: [
        { rel: "canonical", href: canonical },
        { rel: "alternate", hrefLang: "fr", href: SITE_URL + "/hebergements" },
        { rel: "alternate", hrefLang: "en", href: SITE_URL + "/hebergements?lang=en" },
      ],
    };
  },
  component: Page,
});

function Page() {
  const t = useT();
  const h = t.hebergements;

  return (
    <>
      <PageHero
        eyebrow={h.eyebrow}
        title={h.heading}
        intro={h.intro}
        image={couloir}
        imageAlt={h.heroAlt}
      />

      <section className="container-page py-16 sm:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{h.listEyebrow}</p>
          <p className="mt-5 font-serif text-2xl leading-relaxed font-light text-ink sm:text-[1.8rem]">
            {h.listHeading}
          </p>
          <p className="mt-6 text-[0.95rem] leading-relaxed text-muted-foreground">{h.listNote}</p>
        </Reveal>

        <div className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {stays.map((s, i) => (
            <Reveal
              key={s.id}
              delay={i * 70}
              className={cn(
                "flex flex-col p-8 transition-colors duration-500 sm:p-10",
                "highlight" in s ? "bg-sand/50 hover:bg-sand/70" : "bg-background hover:bg-sand/25",
              )}
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-display text-[0.75rem] tracking-[0.2em] uppercase text-olive sm:text-[0.66rem] sm:tracking-[0.24em]">
                  {h.distances[s.distance]}
                </p>
                {"stars" in s ? (
                  <p className="shrink-0 text-[0.8rem] text-muted-foreground">{s.stars}</p>
                ) : null}
              </div>

              <h2 className="mt-4 font-serif text-[1.45rem] leading-snug font-light text-ink">
                {s.name}
              </h2>

              <p className="mt-2 text-[0.82rem] tracking-wide text-muted-foreground/80">
                {h.items[s.id].type}
              </p>

              <p className="mt-5 text-[0.92rem] leading-relaxed text-muted-foreground">
                {h.items[s.id].description}
              </p>

              {h.items[s.id].badge ? (
                <p className="mt-auto pt-6 font-display text-[0.75rem] tracking-[0.2em] uppercase text-olive sm:text-[0.64rem]">
                  {h.items[s.id].badge}
                </p>
              ) : null}
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <p className="mx-auto max-w-2xl text-[0.9rem] leading-relaxed text-muted-foreground">
            {h.footer}
          </p>
        </Reveal>
      </section>
    </>
  );
}
