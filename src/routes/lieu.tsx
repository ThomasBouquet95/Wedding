import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import { Car, Clock, MapPin, TreePalm } from "lucide-react";
import drone from "@/assets/drone.webp";
import cour from "@/assets/cour.webp";
import facadePiscine from "@/assets/facade-piscine.webp";
import parc from "@/assets/parc.webp";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/lieu")({
  head: () => ({
    meta: [
      { title: "Le lieu — Couvent Notre-Dame des Prés, Reillanne" },
      {
        name: "description",
        content:
          "Le Couvent Notre-Dame des Prés à Reillanne, en Provence : adresse, carte, temps de trajet et stationnement.",
      },
      { property: "og:title", content: "Le lieu — Couvent Notre-Dame des Prés" },
      {
        property: "og:description",
        content: "Adresse, carte, temps de trajet et stationnement pour le mariage.",
      },
      { property: "og:url", content: SITE_URL + "/lieu" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/lieu" }],
  }),
  component: Page,
});

const practical = [
  {
    icon: MapPin,
    title: "Adresse",
    text: "Couvent Notre-Dame des Prés, 04110 Reillanne, Provence",
  },
  {
    icon: Clock,
    title: "Temps de trajet",
    text: "Aix-en-Provence 1h · Marseille 1h30 · Avignon 1h15 · Nice 2h15",
  },
  {
    icon: Car,
    title: "Parking",
    text: "Stationnement gratuit sur place, à deux pas de l'entrée du domaine.",
  },
  {
    icon: TreePalm,
    title: "Le domaine",
    text: "Un ancien couvent du XIIIᵉ siècle, ses jardins, sa chapelle, sa piscine et ses oliviers.",
  },
];

function Page() {
  return (
    <>
      <PageHero
        eyebrow="Le lieu"
        title="Couvent Notre-Dame des Prés"
        intro="Un ancien couvent posé au milieu des collines, à Reillanne, entre Luberon et plateau de Valensole."
        image={drone}
        imageAlt="Vue aérienne du Couvent Notre-Dame des Prés et de son parc"
      />

      <section className="container-page grid items-center gap-14 py-20 lg:grid-cols-2 sm:py-28">
        <Reveal>
          <p className="eyebrow">Le domaine</p>
          <h2 className="mt-5 text-3xl font-light text-ink">
            Huit siècles d'histoire, en pierre claire
          </h2>
          <p className="mt-6 text-[0.95rem] leading-relaxed text-muted-foreground">
            Fondé au XIIIᵉ siècle, le Couvent Notre-Dame des Prés fut d'abord un monastère de
            religieuses, bâti à l'écart du village de Reillanne, au milieu des prés qui lui ont
            donné son nom. Sa chapelle et son cloître voûté datent de cette première époque.
          </p>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
            Vendu comme bien national à la Révolution, le couvent devint tour à tour ferme puis
            grande maison de famille. Les longs bâtiments, les arcades de la cour et les terrasses
            ouvertes sur la vallée gardent la trace de ces vies successives.
          </p>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
            Restauré dans le respect de la pierre d'origine, il n'accueille aujourd'hui que quelques
            mariages par an. Nous y passerons tout le week-end : cour ombragée, chapelle, parc aux
            arbres centenaires, bambouseraie et piscine.
          </p>
          <a
            href="https://www.couventnddp.com"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block border-b border-olive/60 pb-1 font-display text-[0.7rem] tracking-[0.24em] uppercase text-ink"
          >
            Visiter le site du couvent
          </a>
        </Reveal>
        <Reveal delay={120} className="grid gap-3 sm:grid-cols-2">
          <div className="img-zoom aspect-[4/3] w-full sm:col-span-2">
            <img
              src={cour}
              alt="La cour intérieure du couvent et ses arcades"
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
          <div className="img-zoom aspect-square w-full">
            <img
              src={facadePiscine}
              alt="La façade du couvent et la piscine"
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
          <div className="img-zoom aspect-square w-full">
            <img
              src={parc}
              alt="Le parc du couvent et ses arbres centenaires"
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
              <h3 className="mt-5 font-display text-[0.72rem] tracking-[0.24em] uppercase text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page py-20 sm:py-24">
        <Reveal>
          <h2 className="text-center text-2xl font-light text-ink">Nous trouver</h2>
          <div className="mt-10 aspect-[16/10] w-full overflow-hidden border border-border sm:aspect-[16/7]">
            <iframe
              title="Carte du Couvent Notre-Dame des Prés à Reillanne"
              src="https://www.google.com/maps?q=Couvent%20Notre-Dame%20des%20Pr%C3%A9s%2C%20Reillanne&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="size-full border-0"
            />
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Couvent+Notre-Dame+des+Pr%C3%A9s+Reillanne"
              target="_blank"
              rel="noreferrer"
              className="border-b border-olive/60 pb-0.5"
            >
              Ouvrir l'itinéraire dans Google Maps
            </a>
          </p>
        </Reveal>
      </section>
    </>
  );
}
