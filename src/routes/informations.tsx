import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import { Car, MessageCircle, Plane, Shirt, Sun, Train } from "lucide-react";
import bambouseraie from "@/assets/bambouseraie.webp";
import { Covoiturage } from "@/components/covoiturage";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { translations, useT } from "@/lib/i18n";

export const Route = createFileRoute("/informations")({
  head: ({ match }) => {
    const p = translations[match.search.lang === "en" ? "en" : "fr"].informations;
    // La version dans l'autre langue est déclarée en `alternate` : sans quoi
    // les moteurs traiteraient les deux URL comme du contenu dupliqué.
    const canonical =
      match.search.lang === "en" ? SITE_URL + "/informations?lang=en" : SITE_URL + "/informations";

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
        { rel: "alternate", hrefLang: "fr", href: SITE_URL + "/informations" },
        { rel: "alternate", hrefLang: "en", href: SITE_URL + "/informations?lang=en" },
      ],
    };
  },
  component: Page,
});

function Page() {
  const t = useT();
  const b = t.informations.blocks;
  const groups = [t.informations.groups.weekend, t.informations.groups.coming] as const;
  const blocks = [
    { icon: Shirt, group: groups[0], ...b.dress },
    { icon: Sun, group: groups[0], ...b.weather },
    { icon: MessageCircle, group: groups[0], ...b.languages },
    { icon: Plane, group: groups[1], ...b.plane },
    { icon: Train, group: groups[1], ...b.train },
    { icon: Car, group: groups[1], ...b.car },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.informations.eyebrow}
        title={t.informations.heading}
        intro={t.informations.intro}
        image={bambouseraie}
        imageAlt={t.informations.heroAlt}
      />

      <section className="container-page py-16 sm:py-24">
        {groups.map((g, gi) => (
          <div
            key={g}
            className={
              gi === 0
                ? "grid gap-10 md:grid-cols-[minmax(0,0.5fr)_minmax(0,1.5fr)] md:gap-16"
                : "mt-16 grid gap-10 border-t border-border pt-16 md:mt-20 md:grid-cols-[minmax(0,0.5fr)_minmax(0,1.5fr)] md:gap-16 md:pt-20"
            }
          >
            <Reveal>
              <h2 className="font-serif text-2xl leading-tight font-light text-ink md:sticky md:top-28">
                {g}
              </h2>
            </Reveal>
            <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {blocks
                .filter((b) => b.group === g)
                .map((b, i) => (
                  <Reveal key={b.title} delay={i * 70} className="border-t border-border/70 pt-6">
                    <b.icon className="size-5 text-olive" strokeWidth={1.1} />
                    <h3 className="mt-5 font-display text-[0.78rem] tracking-[0.22em] uppercase text-ink sm:text-[0.72rem] sm:tracking-[0.24em]">
                      {b.title}
                    </h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                      {b.text}
                    </p>
                  </Reveal>
                ))}
            </div>
          </div>
        ))}
      </section>

      {/* Le tableau de covoiturage entre invités */}
      <Covoiturage />

      <section className="container-page py-16 sm:py-20">
        <Reveal className="text-center">
          <p className="text-[0.95rem] text-muted-foreground">{t.informations.footer}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/faq"
              className="inline-flex min-h-11 items-center border border-olive/50 px-6 py-3 font-display text-[0.75rem] tracking-[0.22em] uppercase text-ink transition-colors hover:bg-olive hover:text-primary-foreground sm:px-7 sm:text-[0.68rem] sm:tracking-[0.24em]"
            >
              {t.informations.faqCta}
            </Link>
            <Link
              to="/hebergements"
              className="inline-flex min-h-11 items-center border border-olive/50 px-6 py-3 font-display text-[0.75rem] tracking-[0.22em] uppercase text-ink transition-colors hover:bg-olive hover:text-primary-foreground sm:px-7 sm:text-[0.68rem] sm:tracking-[0.24em]"
            >
              {t.informations.stayCta}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
