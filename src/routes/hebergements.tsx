import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import chambre from "@/assets/chambre.webp";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/hebergements")({
  head: () => ({
    meta: [
      { title: "Hébergements — Alexandra & Thomas" },
      {
        name: "description",
        content:
          "Hôtels, maisons d'hôtes et locations recommandés autour de Reillanne pour le week-end du mariage.",
      },
      { property: "og:title", content: "Hébergements — Alexandra & Thomas" },
      {
        property: "og:description",
        content: "Nos adresses préférées autour du domaine, à 5 à 25 minutes.",
      },
      { property: "og:url", content: SITE_URL + "/hebergements" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/hebergements" }],
  }),
  component: Page,
});

const stays = [
  {
    name: "Le Couvent Notre-Dame des Prés",
    type: "Sur place · nombre de chambres limité",
    distance: "0 min",
    text: "Quelques chambres sont disponibles au sein même du domaine, attribuées en priorité aux familles.",
  },
  {
    name: "Maisons d'hôtes de Reillanne",
    type: "Chambres d'hôtes",
    distance: "5 min en voiture",
    text: "Plusieurs adresses de charme dans le village, idéales pour un séjour de deux ou trois nuits.",
  },
  {
    name: "Hôtels à Forcalquier",
    type: "Hôtels 3 et 4 étoiles",
    distance: "15 min en voiture",
    text: "La ville la plus proche, avec restaurants, commerces et un large choix d'hôtels.",
  },
  {
    name: "Manosque et alentours",
    type: "Hôtels et résidences",
    distance: "25 min en voiture",
    text: "Une solution pratique si vous arrivez en train ou souhaitez des tarifs plus doux.",
  },
  {
    name: "Locations Airbnb",
    type: "Maisons et mas à partager",
    distance: "5 à 30 min",
    text: "Se regrouper à plusieurs dans un mas est souvent la plus belle option — et la plus économique.",
    link: "https://www.airbnb.fr/s/Reillanne--France/homes",
  },
  {
    name: "Campings et insolite",
    type: "Cabanes, yourtes, campings",
    distance: "10 à 20 min",
    text: "Pour les amoureux du plein air, plusieurs adresses agréables dans la vallée.",
  },
];

function Page() {
  return (
    <>
      <PageHero
        eyebrow="Hébergements"
        title="Où dormir"
        intro="Nous vous conseillons de réserver tôt : la Provence se remplit vite en juin. Voici nos adresses préférées."
        image={chambre}
        imageAlt="Une chambre du Couvent Notre-Dame des Prés"
      />

      <section className="container-page py-16 sm:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Nos adresses</p>
          <p className="mt-5 font-serif text-2xl leading-relaxed font-light text-ink sm:text-[1.8rem]">
            Du domaine lui-même aux mas à partager, tout se trouve à moins de trente minutes.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {stays.map((s, i) => (
            <Reveal
              key={s.name}
              delay={i * 70}
              className="group flex flex-col bg-background p-8 transition-colors duration-500 hover:bg-sand/40 sm:p-10"
            >
              <p className="font-display text-[0.66rem] tracking-[0.24em] uppercase text-olive">
                {s.distance}
              </p>
              <h2 className="mt-4 font-serif text-[1.45rem] leading-snug font-light text-ink">
                {s.name}
              </h2>
              <p className="mt-2 text-[0.82rem] tracking-wide text-muted-foreground/80">{s.type}</p>
              <p className="mt-5 text-[0.92rem] leading-relaxed text-muted-foreground">{s.text}</p>
              {s.link ? (
                <a
                  href={s.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-block self-start border-b border-olive/60 pb-1 font-display text-[0.64rem] tracking-[0.24em] uppercase text-ink transition-colors hover:border-olive hover:text-olive"
                >
                  Voir les annonces
                </a>
              ) : null}
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
            Des navettes relieront Manosque, Forcalquier et le domaine le vendredi et le samedi.
          </p>
        </Reveal>
      </section>
    </>
  );
}