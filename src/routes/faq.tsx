import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import { useState } from "react";
import { Plus } from "lucide-react";
import parc from "@/assets/parc.webp";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "À quelle heure faut-il arriver ?",
    a: "Le vendredi, dès 17h pour vous installer, le cocktail débute à 18h. Le samedi, merci d'être sur place 20 minutes avant la cérémonie, prévue vers 16h.",
  },
  {
    q: "Peut-on venir avec des enfants ?",
    a: "Oui, les enfants sont les bienvenus tout le week-end. Une garde et des animations seront prévues le samedi soir : les détails seront précisés avec les mariés.",
  },
  {
    q: "Quel est le dress code ?",
    a: "Élégance estivale, dans des tons naturels. Évitez les talons trop fins : les allées sont en gravier. Prévoyez une étole pour la soirée.",
  },
  {
    q: "Où dormir ?",
    a: "Quelques chambres sont disponibles au domaine, et nous avons rassemblé nos adresses préférées sur la page Hébergements. Réservez tôt : juin est une période très demandée.",
  },
  {
    q: "Où se garer ?",
    a: "Un parking gratuit se trouve à l'entrée du domaine. Les voitures peuvent y rester la nuit sans problème.",
  },
  {
    q: "Puis-je venir avec un accompagnant ?",
    a: "Votre invitation précise le nombre de places qui vous sont réservées. En cas de doute, écrivez-nous et nous verrons ensemble.",
  },
  {
    q: "Y a-t-il des navettes ?",
    a: "Oui, des navettes relieront Manosque et Forcalquier au domaine le vendredi et le samedi, ainsi que les retours en fin de soirée. Les horaires seront communiqués au printemps 2027.",
  },
  {
    q: "Quand aurai-je les derniers détails ?",
    a: "Les horaires définitifs, les navettes et les derniers détails seront publiés ici au printemps 2027.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Alexandra & Thomas" },
      {
        name: "description",
        content:
          "Réponses aux questions les plus fréquentes : horaires, enfants, dress code, hébergement, parking et navettes.",
      },
      { property: "og:title", content: "FAQ — Alexandra & Thomas" },
      { property: "og:description", content: "Horaires, enfants, dress code, hébergement, parking." },
      { property: "og:url", content: SITE_URL + "/faq" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Page,
});

function Page() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions fréquentes"
        intro="Les réponses aux questions que l'on nous pose le plus souvent sur le week-end."
        image={parc}
        imageAlt="Le parc du Couvent Notre-Dame des Prés"
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
            <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
              Une question qui n'est pas là&nbsp;? Les mariés restent joignables directement.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}