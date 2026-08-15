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
    q: "Quel est le dress code ?",
    a: "Pour la soirée du samedi, robe longue pour les femmes et costume pour les hommes. Le vendredi soir et le dimanche, tenue plus décontractée mais soignée. Évitez les talons trop fins : les allées sont en gravier. Prévoyez une étole pour la fraîcheur du soir.",
  },
  {
    q: "Où dormir ?",
    a: "Il ne reste pas de place au domaine : les chambres sont déjà attribuées. Nous avons rassemblé dix adresses autour du couvent, de 3 à 21 minutes, sur la page Hébergements. Réservez tôt : juin est une période très demandée en Provence.",
  },
  {
    q: "Où se garer ?",
    a: "Un parking gratuit se trouve à l'entrée du domaine.",
  },
  {
    q: "Puis-je venir avec un accompagnant ?",
    a: "Votre invitation précise le nombre de places qui vous sont réservées. En cas de doute, écrivez-nous et nous verrons ensemble.",
  },
  {
    q: "Comment se rendre au domaine et en repartir ?",
    a: "Chacun organise son trajet : il n'y a pas de navette à l'arrivée ni au départ. Pour faciliter le covoiturage, nous mettrons en place une liste des personnes venant en voiture avec des places libres. Le samedi soir, à l'issue de la cérémonie, du dîner et de la soirée, un retour sera assuré vers les hébergements les plus proches.",
  },
  {
    q: "Nous aimerions soutenir le mariage, comment faire ?",
    a: "Contactez directement Alexandra ou Thomas : ce sont eux qui s'en occupent.",
  },
  {
    q: "Quand aurai-je les derniers détails ?",
    a: "Les horaires définitifs et les derniers détails seront publiés ici au printemps 2027.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Alexandra & Thomas" },
      {
        name: "description",
        content:
          "Réponses aux questions les plus fréquentes : horaires, dress code, hébergement, parking et trajets.",
      },
      { property: "og:title", content: "FAQ — Alexandra & Thomas" },
      {
        property: "og:description",
        content: "Horaires, dress code, hébergement, parking, trajets.",
      },
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
        imageAlt="La piscine du domaine et ses transats"
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
