import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import { Car, MessageCircle, Plane, Shirt, Sun, Train } from "lucide-react";
import bambouseraie from "@/assets/bambouseraie.webp";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/informations")({
  head: () => ({
    meta: [
      { title: "Informations pratiques — Alexandra & Thomas" },
      {
        name: "description",
        content:
          "Dress code, météo, transports, parking et langues parlées pour le mariage des 25 et 26 juin 2027 en Provence.",
      },
      { property: "og:title", content: "Informations pratiques — Alexandra & Thomas" },
      {
        property: "og:description",
        content: "Dress code, météo, transports, parking et navettes.",
      },
      { property: "og:url", content: SITE_URL + "/informations" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/informations" }],
  }),
  component: Page,
});

const blocks = [
  {
    icon: Shirt,
    title: "Dress code",
    group: "Le week-end",
    text: "Élégance. Pour la soirée du samedi, robe longue attendue pour les femmes et costume pour les hommes. Le vendredi soir et le dimanche, tenue plus décontractée mais soignée. Prévoyez des talons compatibles avec les allées de gravier et une étole pour la fraîcheur du soir.",
  },
  {
    icon: Sun,
    title: "Météo habituelle",
    group: "Le week-end",
    text: "Fin juin en Provence : 28 à 32 °C en journée, 17 à 20 °C en soirée. Soleil franc, ombre précieuse et nuits douces.",
  },
  {
    icon: MessageCircle,
    title: "Langues parlées",
    group: "Le week-end",
    text: "Le week-end se déroulera en français et en anglais. Les moments clés de la cérémonie seront traduits.",
  },
  {
    icon: Plane,
    title: "En avion",
    group: "Y venir",
    text: "Aéroport Marseille-Provence à 1h15, Nice Côte d'Azur à 2h15. Location de voiture conseillée à l'arrivée.",
  },
  {
    icon: Train,
    title: "En train",
    group: "Y venir",
    text: "Gare TGV Aix-en-Provence (1h) ou gare de Manosque-Gréoux (25 min). Nous organiserons des navettes depuis Manosque le vendredi et le samedi.",
  },
  {
    icon: Car,
    title: "En voiture et parking",
    group: "Y venir",
    text: "A51 sortie Manosque, puis 25 minutes de petites routes. Parking gratuit et sécurisé au domaine, les voitures peuvent y rester la nuit.",
  },
];

const groups = ["Le week-end", "Y venir"] as const;

function Page() {
  return (
    <>
      <PageHero
        eyebrow="Informations pratiques"
        title="Tout ce qu'il faut savoir"
        intro="Quelques repères pour préparer sereinement votre week-end en Provence."
        image={bambouseraie}
        imageAlt="La bambouseraie du domaine"
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
                    <h3 className="mt-5 font-display text-[0.72rem] tracking-[0.24em] uppercase text-ink">
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

        <Reveal className="mt-20 border-t border-border pt-12 text-center">
          <p className="text-[0.95rem] text-muted-foreground">
            D'autres questions&nbsp;? La plupart des réponses sont déjà là.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/faq"
              className="border border-olive/50 px-7 py-3 font-display text-[0.68rem] tracking-[0.24em] uppercase text-ink transition-colors hover:bg-olive hover:text-primary-foreground"
            >
              Consulter les questions fréquentes
            </Link>
            <Link
              to="/hebergements"
              className="border border-olive/50 px-7 py-3 font-display text-[0.68rem] tracking-[0.24em] uppercase text-ink transition-colors hover:bg-olive hover:text-primary-foreground"
            >
              Voir les hébergements
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}