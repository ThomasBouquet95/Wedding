import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import { Calendar, Car, Instagram, MapPin, Shirt } from "lucide-react";
import hero from "@/assets/hero.webp";
import cour from "@/assets/cour.webp";
import facadePiscine from "@/assets/facade-piscine.webp";
import parc from "@/assets/parc.webp";
import drone from "@/assets/drone.webp";
import bambouseraie from "@/assets/bambouseraie.webp";
import chambre from "@/assets/chambre.webp";
import olive from "@/assets/olive-sprig.webp";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alexandra & Thomas — Mariage en Provence, 25-26 juin 2027" },
      {
        name: "description",
        content:
          "Toutes les informations pratiques du mariage d'Alexandra & Thomas, les 25 et 26 juin 2027 au Couvent Notre-Dame des Prés à Reillanne, avec une journée libre le 27 : programme, accès, hébergements.",
      },
      { property: "og:title", content: "Alexandra & Thomas — 25-26 juin 2027" },
      {
        property: "og:description",
        content:
          "Programme, accès et hébergements pour le week-end au Couvent Notre-Dame des Prés, Reillanne.",
      },
      { property: "og:url", content: SITE_URL + "/" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/" }],
  }),
  component: Index,
});

const facts = [
  {
    icon: Calendar,
    label: "Les dates",
    value: "Vendredi 25 et samedi 26 juin 2027 · dimanche 27, journée libre",
  },
  { icon: MapPin, label: "Le lieu", value: "Couvent Notre-Dame des Prés, Reillanne" },
  { icon: Shirt, label: "Tenue", value: "Robe longue et costume pour le samedi soir" },
  { icon: Car, label: "Accès", value: "Aix 1h · Marseille 1h30 · parking sur place" },
];

const sections = [
  {
    to: "/programme",
    n: "01",
    label: "Le programme",
    text: "Le déroulé du week-end : soirée d'accueil le vendredi, cérémonie et dîner le samedi, journée libre le dimanche.",
    image: drone,
    alt: "Vue aérienne du couvent, de son parc et de la piscine",
  },
  {
    to: "/informations",
    n: "02",
    label: "Comment venir",
    text: "Train, avion, voiture, navettes depuis Manosque et stationnement au domaine.",
    image: facadePiscine,
    alt: "La façade du couvent et la piscine, en plein jour",
  },
  {
    to: "/hebergements",
    n: "03",
    label: "Où dormir",
    text: "Nos adresses préférées, du village de Reillanne à Forcalquier, de 5 à 25 minutes.",
    image: chambre,
    alt: "Une chambre du couvent, fenêtre ouverte sur le parc",
  },
] as const;

function Index() {
  return (
    <>
      {/* Hero : la photographie porte tout, la typographie s'y pose */}
      <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pb-14 sm:pb-20">
        <img
          src={hero}
          alt="La façade du Couvent Notre-Dame des Prés et sa piscine, sous le soleil de Provence"
          width={1500}
          height={2250}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-10 size-full object-cover object-[50%_45%]"
        />
        {/* Voile sombre unique, concentré sur le bas où se pose le titre. */}
        <div className="absolute inset-0 z-[-8] bg-gradient-to-t from-ink/82 via-ink/48 to-ink/12" />

        <div className="container-page">
          <Reveal>
            <p className="label-xs text-background">Provence · 2027</p>
            <h1 className="mt-6 display-xl text-background">
              Alexandra
              <span className="mx-3 font-serif italic text-background/70 sm:mx-5">&amp;</span>
              Thomas
            </h1>

            <div className="mt-9 flex flex-col gap-6 border-t border-background/25 pt-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="label-xs text-background">25 — 26 juin 2027</p>
                <p className="mt-2 text-[0.95rem] text-background/80">
                  Couvent Notre-Dame des Prés · Reillanne
                </p>
              </div>
              <Link
                to="/programme"
                className="inline-flex w-fit items-center gap-3 border border-background/45 px-7 py-3.5 label-xs text-background transition-colors hover:bg-background hover:text-ink"
              >
                Découvrir le week-end
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Le mot d'accueil */}
      <section className="container-narrow py-24 text-center sm:py-32">
        <Reveal>
          <img
            src={olive}
            alt=""
            aria-hidden="true"
            data-tone="raw"
            className="mx-auto h-10 w-auto opacity-70"
          />
          <p className="mx-auto mt-10 font-serif text-[1.6rem] leading-[1.5] font-light text-ink italic sm:text-[2rem]">
            Un été en Provence, dans un couvent du XIIIᵉ siècle, entre pierre claire, cyprès et
            oliviers.
          </p>
          <div className="mx-auto mt-10 h-px w-16 bg-border" />
          <p className="mx-auto mt-10 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
            Vous trouverez ici tout ce dont vous avez besoin pour préparer votre venue : le déroulé
            des journées, le domaine, les accès et nos adresses pour dormir aux alentours.
          </p>
        </Reveal>
      </section>

      {/* Les repères essentiels */}
      <section className="border-y border-border/70 bg-sage-soft/35">
        <div className="container-page grid divide-y divide-border/70 sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal
              key={f.label}
              delay={i * 90}
              className="px-0 py-9 sm:px-8 sm:first:pl-0 lg:last:pr-0"
            >
              <f.icon className="size-4 text-olive" strokeWidth={1.2} />
              <p className="mt-5 label-xs text-olive">{f.label}</p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink">{f.value}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Le lieu */}
      <section className="grid lg:grid-cols-2">
        <Reveal className="order-2 flex items-center px-6 py-20 sm:px-14 lg:order-1 lg:py-28">
          <div className="max-w-md">
            <p className="eyebrow">Le lieu</p>
            <h2 className="mt-6 display-md text-ink">
              Un couvent du XIIIᵉ, posé dans les collines
            </h2>
            <p className="mt-6 text-[0.95rem] leading-relaxed text-muted-foreground">
              Cour ombragée, chapelle, longues terrasses ouvertes sur la vallée : nous y passerons
              tout le week-end, entre Luberon et plateau de Valensole.
            </p>
            <Link
              to="/lieu"
              className="group mt-9 inline-flex items-center gap-3 label-xs text-ink"
            >
              Découvrir le domaine
              <span className="h-px w-8 bg-olive transition-all duration-500 group-hover:w-14" />
            </Link>
          </div>
        </Reveal>
        <div className="img-zoom order-1 h-[54svh] lg:order-2 lg:h-auto">
          <img
            src={cour}
            alt="La cour intérieure du couvent et ses arcades, tables dressées en plein jour"
            loading="lazy"
            className="size-full object-cover"
          />
        </div>
      </section>

      {/* Les trois entrées principales */}
      <section className="container-page py-24 sm:py-32">
        <Reveal className="max-w-xl">
          <p className="eyebrow">Préparer votre venue</p>
          <h2 className="mt-5 display-md text-ink">L'essentiel, en trois pages</h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {sections.map((item, i) => (
            <Reveal key={item.to} delay={i * 130}>
              <Link to={item.to} className="group block">
                <div className="img-zoom aspect-[4/5] w-full">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                </div>
                <div className="mt-6 flex items-baseline gap-4">
                  <span className="label-xs text-olive">{item.n}</span>
                  <h3 className="font-serif text-2xl font-light text-ink transition-colors group-hover:text-olive">
                    {item.label}
                  </h3>
                </div>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Invitation à la galerie */}
      <section className="relative isolate flex min-h-[52svh] items-center overflow-hidden">
        <img
          src={parc}
          alt="Le parc du Couvent Notre-Dame des Prés"
          loading="lazy"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        {/* Le texte est centré sur toute la hauteur : ici un voile uniforme,
            un peu plus dense, plutôt qu'un dégradé. */}
        <div className="absolute inset-0 z-[-8] bg-ink/45" />

        <Reveal className="container-page py-20 text-center">
          <p className="label-xs text-background/85">Galerie</p>
          <p className="mx-auto mt-6 max-w-xl font-serif text-[1.5rem] leading-snug font-light text-background italic sm:text-[1.9rem]">
            Le domaine, ses jardins et la lumière de juin.
          </p>
          <Link
            to="/galerie"
            className="mt-10 inline-block border border-background/45 px-8 py-3.5 label-xs text-background transition-colors hover:bg-background hover:text-ink"
          >
            Voir les images
          </Link>
        </Reveal>
      </section>

      {/* Bon à savoir */}
      {/* Instagram du domaine */}
      <section className="border-t border-border/70 bg-sage-soft/30">
        <div className="container-page py-20 sm:py-24">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow">Instagram</p>
              <h2 className="mt-5 display-md text-ink">Le domaine, au fil des saisons</h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                Le Couvent partage régulièrement ses images sur Instagram : la lumière, les jardins
                et les tables dressées, avant notre week-end de juin.
              </p>
            </div>
            <a
              href="https://www.instagram.com/couventnotredamedespres/"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex w-fit items-center gap-3 border border-olive/50 px-7 py-3.5 label-xs text-ink transition-colors hover:bg-olive hover:text-primary-foreground"
            >
              <Instagram className="size-4" strokeWidth={1.2} />
              @couventnotredamedespres
            </a>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { src: parc, alt: "Le parc du couvent" },
              { src: bambouseraie, alt: "La bambouseraie du domaine" },
              { src: drone, alt: "Vue aérienne du domaine" },
              { src: chambre, alt: "Une chambre du couvent" },
            ].map((p, i) => (
              <Reveal key={p.alt} delay={i * 90}>
                <a
                  href="https://www.instagram.com/couventnotredamedespres/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="img-zoom relative block aspect-square w-full"
                >
                  <img src={p.src} alt={p.alt} loading="lazy" className="size-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-500 hover:bg-ink/35 hover:opacity-100">
                    <Instagram className="size-5 text-background" strokeWidth={1.2} />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bon à savoir */}
      <section className="container-narrow py-24 text-center sm:py-28">
        <Reveal>
          <p className="eyebrow">Bon à savoir</p>
          <p className="mx-auto mt-6 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
            Les horaires définitifs, les navettes depuis Manosque et les derniers détails seront mis
            à jour sur ce site au printemps 2027.
          </p>
          <Link
            to="/faq"
            className="mt-9 inline-block border border-olive/50 px-8 py-3.5 label-xs text-ink transition-colors hover:bg-olive hover:text-primary-foreground"
          >
            Questions fréquentes
          </Link>
        </Reveal>
      </section>
    </>
  );
}
