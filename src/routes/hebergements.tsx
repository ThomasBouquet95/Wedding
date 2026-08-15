import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import couloir from "@/assets/couloir.webp";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hebergements")({
  head: () => ({
    meta: [
      { title: "Hébergements — Alexandra & Thomas" },
      {
        name: "description",
        content:
          "Dix hôtels, chambres d'hôtes et gîtes repérés autour de Reillanne pour le week-end du mariage, de 3 à 21 minutes du domaine.",
      },
      { property: "og:title", content: "Hébergements — Alexandra & Thomas" },
      {
        property: "og:description",
        content: "Nos adresses repérées autour du domaine, de 3 à 21 minutes.",
      },
      { property: "og:url", content: SITE_URL + "/hebergements" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/hebergements" }],
  }),
  component: Page,
});

/**
 * Les adresses repérées autour du domaine, classées de la plus proche à la
 * plus éloignée. `highlight` marque les deux adresses que nous recommandons
 * en premier : ce sont les seules assez proches pour rentrer à pied.
 */
const stays = [
  {
    name: "Domaine Paradis",
    type: "Chambre d'hôtes",
    stars: "3★",
    price: "200 €",
    distance: "3 min en voiture · 15 min à pied",
    highlight: true,
    forWhom: "Idéal entre amis",
    text: "Tout près du domaine, et la seule adresse avec les Pradaous d'où l'on peut rentrer à pied.",
  },
  {
    name: "Domaine des Pradaous",
    type: "Gîte",
    price: "165 €",
    distance: "3 min en voiture · 20 min à pied",
    highlight: true,
    forWhom: "Idéal entre amis",
    text: "À deux pas du domaine, en gîte : parfait pour se regrouper à plusieurs.",
  },
  {
    name: "Le Moulin des Prédelles",
    type: "Chambre d'hôtes",
    stars: "3★",
    price: "160 €",
    distance: "6 min en voiture",
    forWhom: "Peu adapté aux groupes d'amis",
  },
  {
    name: "Lou Paradou",
    type: "Hôtel",
    stars: "3★",
    price: "150 €",
    distance: "7 min en voiture",
  },
  {
    name: "Le Sens des Merveilles",
    type: "Gîte",
    price: "160 €",
    distance: "15 min en voiture",
    forWhom: "Bien entre amis, ambiance jeune",
  },
  {
    name: "Le Couvent des Minimes",
    type: "Hôtel",
    stars: "5★",
    price: "300 €",
    distance: "17 min en voiture",
    forWhom: "Bien en famille",
    text: "L'adresse la plus luxueuse de la sélection ; un bloc de chambres y est réservé.",
  },
  {
    name: "La Bastide Saint Georges",
    type: "Hôtel",
    stars: "4★",
    price: "200 €",
    distance: "20 min en voiture",
    forWhom: "Bien en famille",
  },
  {
    name: "Les Prairies de l'Encrême",
    type: "Gîte",
    stars: "3★",
    price: "300 € la maison entière",
    distance: "20 min en voiture",
    text: "Location entière, à partager entre plusieurs.",
  },
  {
    name: "Provence Au Cœur",
    type: "Apart'hôtel",
    stars: "4★",
    price: "120 €",
    distance: "20 min en voiture",
  },
  {
    name: "Villa Saint Marc",
    type: "Chambre d'hôtes",
    stars: "3★",
    price: "50 €",
    distance: "21 min en voiture",
    text: "L'option la plus économique de la sélection.",
  },
];

function Page() {
  return (
    <>
      <PageHero
        eyebrow="Hébergements"
        title="Où dormir"
        intro="Réservez tôt : la Provence se remplit vite en juin. Voici les adresses que nous avons repérées autour du domaine."
        image={couloir}
        imageAlt="Un couloir du Couvent Notre-Dame des Prés, oliviers en pot"
      />

      <section className="container-page py-16 sm:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Nos adresses</p>
          <p className="mt-5 font-serif text-2xl leading-relaxed font-light text-ink sm:text-[1.8rem]">
            Dix adresses repérées autour du domaine, de trois à vingt minutes.
          </p>
          <p className="mt-6 text-[0.95rem] leading-relaxed text-muted-foreground">
            Les chambres du domaine sont déjà attribuées : il n'y reste pas de place. Les tarifs
            sont indicatifs, par nuit, et méritent d'être revérifiés au moment de réserver.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {stays.map((s, i) => (
            <Reveal
              key={s.name}
              delay={i * 70}
              className={cn(
                "flex flex-col p-8 transition-colors duration-500 sm:p-10",
                s.highlight ? "bg-sand/50 hover:bg-sand/70" : "bg-background hover:bg-sand/25",
              )}
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-display text-[0.66rem] tracking-[0.24em] uppercase text-olive">
                  {s.distance}
                </p>
                {s.stars ? (
                  <p className="shrink-0 text-[0.8rem] text-muted-foreground">{s.stars}</p>
                ) : null}
              </div>

              <h2 className="mt-4 font-serif text-[1.45rem] leading-snug font-light text-ink">
                {s.name}
              </h2>

              <p className="mt-2 text-[0.82rem] tracking-wide text-muted-foreground/80">
                {s.type} · {s.price} la nuit
              </p>

              {s.text ? (
                <p className="mt-5 text-[0.92rem] leading-relaxed text-muted-foreground">
                  {s.text}
                </p>
              ) : null}

              {s.forWhom ? (
                <p className="mt-auto pt-6 font-display text-[0.62rem] tracking-[0.22em] uppercase text-olive">
                  {s.forWhom}
                </p>
              ) : null}
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <p className="mx-auto max-w-2xl text-[0.9rem] leading-relaxed text-muted-foreground">
            Prévoyez votre trajet jusqu'au domaine : il n'y a pas de navette à l'arrivée ni au
            départ. Le samedi soir, un retour sera assuré vers les hébergements les plus proches.
          </p>
        </Reveal>
      </section>
    </>
  );
}
