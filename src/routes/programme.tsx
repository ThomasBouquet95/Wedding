import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import cour from "@/assets/cour.webp";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { translations, useT } from "@/lib/i18n";

export const Route = createFileRoute("/programme")({
  head: ({ match }) => {
    const p = translations[match.search.lang === "en" ? "en" : "fr"].programme;
    // La version dans l'autre langue est déclarée en `alternate` : sans quoi
    // les moteurs traiteraient les deux URL comme du contenu dupliqué.
    const canonical =
      match.search.lang === "en" ? SITE_URL + "/programme?lang=en" : SITE_URL + "/programme";

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
        { rel: "alternate", hrefLang: "fr", href: SITE_URL + "/programme" },
        { rel: "alternate", hrefLang: "en", href: SITE_URL + "/programme?lang=en" },
      ],
    };
  },
  component: Page,
});

function Page() {
  const t = useT();
  const days = t.programme.days;

  return (
    <>
      <PageHero
        eyebrow={t.programme.eyebrow}
        title={t.programme.heading}
        intro={t.programme.intro}
        image={cour}
        imageAlt={t.programme.heroAlt}
      />

      <section className="container-page py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          {days.map((d, i) => (
            <Reveal
              key={d.day}
              delay={i * 100}
              className="grid gap-8 border-t border-border py-14 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-16"
            >
              <div className="md:sticky md:top-28 md:self-start">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-[0.68rem] tracking-[0.28em] text-olive">
                    {`0${i + 1}`}
                  </span>
                  <p className="eyebrow">{d.subtitle}</p>
                </div>
                <h2 className="mt-4 font-serif text-3xl leading-tight font-light text-ink sm:text-[2.6rem]">
                  {d.day}
                </h2>
                <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
                  {d.note}
                </p>
              </div>

              <ul className="relative border-l border-border pl-8 sm:pl-10">
                {d.events.map((e) => (
                  <li key={e.label} className="relative pb-10 last:pb-0">
                    <span
                      aria-hidden
                      className="absolute top-[0.55rem] -left-[calc(2rem+3px)] size-[5px] rounded-full bg-olive sm:-left-[calc(2.5rem+3px)]"
                    />
                    <p className="font-display text-[0.75rem] tracking-[0.22em] uppercase text-muted-foreground sm:text-[0.68rem] sm:tracking-[0.24em]">
                      {e.time}
                    </p>
                    <p className="mt-2 font-serif text-xl leading-snug font-light text-ink">
                      {e.label}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-8 max-w-5xl border-t border-border pt-10">
          <p className="text-center text-[0.9rem] leading-relaxed text-muted-foreground">
            {t.programme.footer}
          </p>
        </Reveal>
      </section>
    </>
  );
}
