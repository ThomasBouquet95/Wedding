import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import { useState } from "react";
import { Plus } from "lucide-react";
import parc from "@/assets/parc.webp";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";
import { translations, useT } from "@/lib/i18n";

export const Route = createFileRoute("/faq")({
  head: ({ match }) => {
    const p = translations[match.search.lang === "en" ? "en" : "fr"].faq;
    // La version dans l'autre langue est déclarée en `alternate` : sans quoi
    // les moteurs traiteraient les deux URL comme du contenu dupliqué.
    const canonical = match.search.lang === "en" ? SITE_URL + "/faq?lang=en" : SITE_URL + "/faq";

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
        { rel: "alternate", hrefLang: "fr", href: SITE_URL + "/faq" },
        { rel: "alternate", hrefLang: "en", href: SITE_URL + "/faq?lang=en" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: translations[match.search.lang === "en" ? "en" : "fr"].faq.items.map(
              (f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              }),
            ),
          }),
        },
      ],
    };
  },
  component: Page,
});

function Page() {
  const t = useT();
  const faqs = t.faq.items;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <PageHero
        eyebrow={t.faq.eyebrow}
        title={t.faq.heading}
        intro={t.faq.intro}
        image={parc}
        imageAlt={t.faq.heroAlt}
      />

      <section className="container-page py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 50}>
              <div className="border-b border-border first:border-t">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  aria-controls={`faq-reponse-${i}`}
                  id={`faq-question-${i}`}
                  className="flex w-full items-baseline gap-5 py-7 text-left sm:gap-8"
                >
                  <span className="shrink-0 font-display text-[0.66rem] tracking-[0.24em] text-olive">
                    {`0${i + 1}`}
                  </span>
                  <span className="flex-1 font-serif text-xl leading-snug font-light text-ink sm:text-[1.4rem]">
                    {f.q}
                  </span>
                  <Plus
                    strokeWidth={1}
                    className={cn(
                      "mt-1 size-4 shrink-0 text-olive transition-transform duration-500",
                      open === i && "rotate-45",
                    )}
                  />
                </button>
                <div
                  id={`faq-reponse-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  aria-hidden={open !== i}
                  className={cn(
                    "grid transition-all duration-500 sm:pl-[3.4rem]",
                    open === i ? "grid-rows-[1fr] pb-7 opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <p className="max-w-xl overflow-hidden text-[0.95rem] leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal className="mt-14 text-center">
            <p className="text-[0.9rem] leading-relaxed text-muted-foreground">{t.faq.footer}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
