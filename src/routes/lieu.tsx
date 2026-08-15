import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import { Car, Clock, MapPin, TreePalm } from "lucide-react";
import drone from "@/assets/drone.webp";
import cour from "@/assets/cour.webp";
import facadePiscine from "@/assets/facade-piscine.webp";
import parc from "@/assets/parc.webp";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { translations, useT } from "@/lib/i18n";

export const Route = createFileRoute("/lieu")({
  head: ({ match }) => {
    const p = translations[match.search.lang === "en" ? "en" : "fr"].lieu;
    // La version dans l'autre langue est déclarée en `alternate` : sans quoi
    // les moteurs traiteraient les deux URL comme du contenu dupliqué.
    const canonical = match.search.lang === "en" ? SITE_URL + "/lieu?lang=en" : SITE_URL + "/lieu";

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
        { rel: "alternate", hrefLang: "fr", href: SITE_URL + "/lieu" },
        { rel: "alternate", hrefLang: "en", href: SITE_URL + "/lieu?lang=en" },
      ],
    };
  },
  component: Page,
});

function Page() {
  const t = useT();
  const practical = [
    { icon: MapPin, ...t.lieu.practical[0]! },
    { icon: Clock, ...t.lieu.practical[1]! },
    { icon: Car, ...t.lieu.practical[2]! },
    { icon: TreePalm, ...t.lieu.practical[3]! },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.lieu.eyebrow}
        title={t.lieu.heading}
        intro={t.lieu.intro}
        image={drone}
        imageAlt={t.lieu.heroAlt}
      />

      <section className="container-page grid items-center gap-14 py-20 lg:grid-cols-2 sm:py-28">
        <Reveal>
          <p className="eyebrow">{t.lieu.domainEyebrow}</p>
          <h2 className="mt-5 text-3xl font-light text-ink">{t.lieu.domainHeading}</h2>
          <p className="mt-6 text-[0.95rem] leading-relaxed text-muted-foreground">{t.lieu.p1}</p>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">{t.lieu.p2}</p>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">{t.lieu.p3}</p>
          <a
            href="https://www.couventnddp.com"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-11 items-center border-b border-olive/60 font-display text-[0.75rem] tracking-[0.24em] uppercase text-ink sm:text-[0.7rem]"
          >
            {t.lieu.siteCta}
          </a>
        </Reveal>
        <Reveal delay={120} className="grid gap-3 sm:grid-cols-2">
          <div className="img-zoom aspect-[4/3] w-full sm:col-span-2">
            <img
              src={cour}
              alt={t.lieu.alts.cour}
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
          <div className="img-zoom aspect-square w-full">
            <img
              src={facadePiscine}
              alt={t.lieu.alts.facadePiscine}
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
          <div className="img-zoom aspect-square w-full">
            <img
              src={parc}
              alt={t.lieu.alts.parc}
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section className="bg-sage-soft/50 py-20 sm:py-24">
        <div className="container-page grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {practical.map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <item.icon className="size-5 text-olive" strokeWidth={1.1} />
              <h3 className="mt-5 font-display text-[0.78rem] tracking-[0.22em] uppercase text-ink sm:text-[0.72rem] sm:tracking-[0.24em]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page py-20 sm:py-24">
        <Reveal>
          <h2 className="text-center text-2xl font-light text-ink">{t.lieu.findUs}</h2>
          <div className="mt-10 aspect-[16/10] w-full overflow-hidden border border-border sm:aspect-[16/7]">
            <iframe
              title={t.lieu.mapTitle}
              src="https://www.google.com/maps?q=Couvent%20Notre-Dame%20des%20Pr%C3%A9s%2C%20Reillanne&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="size-full border-0"
            />
          </div>
          {/* Bloc plutôt qu'un lien noyé dans un paragraphe : c'est l'action
              principale de la section, et sur téléphone un lien en ligne ne
              faisait que 19 px de haut. */}
          <div className="mt-6 text-center">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Couvent+Notre-Dame+des+Pr%C3%A9s+Reillanne"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center border border-olive/50 px-6 py-3 font-display text-[0.75rem] tracking-[0.22em] uppercase text-ink transition-colors hover:bg-olive hover:text-primary-foreground sm:text-[0.68rem] sm:tracking-[0.24em]"
            >
              {t.lieu.itinerary}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
