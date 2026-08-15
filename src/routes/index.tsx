import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import { Calendar, Car, Instagram, MapPin, Shirt } from "lucide-react";
import couple from "@/assets/couple.webp";
import coupleMobile from "@/assets/couple-mobile.webp";
import cour from "@/assets/cour.webp";
import facadePiscine from "@/assets/facade-piscine.webp";
import parc from "@/assets/parc.webp";
import drone from "@/assets/drone.webp";
import bambouseraie from "@/assets/bambouseraie.webp";
import couloir from "@/assets/couloir.webp";
import olive from "@/assets/olive-sprig.webp";
import { Reveal } from "@/components/reveal";
import { translations, useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: ({ match }) => {
    const p = translations[match.search.lang === "en" ? "en" : "fr"].home;
    // La version dans l'autre langue est déclarée en `alternate` : sans quoi
    // les moteurs traiteraient les deux URL comme du contenu dupliqué.
    const canonical = match.search.lang === "en" ? SITE_URL + "/?lang=en" : SITE_URL + "/";

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
        { rel: "alternate", hrefLang: "fr", href: SITE_URL + "/" },
        { rel: "alternate", hrefLang: "en", href: SITE_URL + "/?lang=en" },
      ],
    };
  },
  component: Index,
});

function Index() {
  const t = useT();
  const home = t.home;
  const facts = [
    { icon: Calendar, ...home.facts.dates },
    { icon: MapPin, ...home.facts.place },
    { icon: Shirt, ...home.facts.dress },
    { icon: Car, ...home.facts.access },
  ];
  const sections = [
    { to: "/programme", n: "01", image: bambouseraie, ...home.sections.programme },
    { to: "/informations", n: "02", image: facadePiscine, ...home.sections.informations },
    { to: "/hebergements", n: "03", image: couloir, ...home.sections.hebergements },
  ] as const;

  return (
    <>
      {/* Hero : la photographie porte tout, la typographie s'y pose */}
      <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pb-14 sm:pb-20">
        {/* Direction artistique plutôt qu'un simple redimensionnement : sur un
            téléphone, un cadrage large est réduit à une bande verticale
            étroite — ici moins de la moitié de la largeur — qui couperait les
            mariés. La variante mobile est recadrée en amont autour d'eux
            deux. Le cadrage vertical est remonté : les visages sont dans le
            tiers supérieur, le voile sombre occupe le bas. */}
        <picture className="absolute inset-0 -z-10">
          <source media="(max-width: 767px)" srcSet={coupleMobile} width={984} height={1894} />
          <img
            src={couple}
            alt={home.heroAlt}
            width={2048}
            height={1894}
            fetchPriority="high"
            decoding="async"
            className="size-full object-cover object-[50%_28%]"
          />
        </picture>
        {/* Voile resserré sur le bas : sur une photographie de paysage il
            pouvait monter haut sans dommage, mais ici il assombrirait les
            mariés eux-mêmes. Il s'arrête donc sous les visages. */}
        <div className="absolute inset-0 z-[-8] bg-gradient-to-t from-ink/90 from-0% via-ink/70 via-42% to-transparent to-68%" />

        <div className="container-page">
          <Reveal>
            <p className="label-xs text-background">{home.eyebrow}</p>
            <h1 className="mt-6 display-xl text-background">
              Alexandra
              <span className="mx-3 font-serif italic text-background/70 sm:mx-5">&amp;</span>
              Thomas
            </h1>

            <div className="mt-9 flex flex-col gap-6 border-t border-background/25 pt-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="label-xs text-background">{home.dates}</p>
                <p className="mt-2 text-[0.95rem] text-background/80">{home.place}</p>
              </div>
              <Link
                to="/programme"
                className="inline-flex w-full items-center justify-center gap-3 border border-background/45 px-6 py-4 label-xs text-background transition-colors hover:bg-background hover:text-ink sm:w-fit sm:px-7 sm:py-3.5"
              >
                {home.cta}
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
            {home.quote}
          </p>
          <div className="mx-auto mt-10 h-px w-16 bg-border" />
          <p className="mx-auto mt-10 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
            {home.intro}
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
            <p className="eyebrow">{home.venue.eyebrow}</p>
            <h2 className="mt-6 display-md text-ink">{home.venue.heading}</h2>
            <p className="mt-6 text-[0.95rem] leading-relaxed text-muted-foreground">
              {home.venue.text}
            </p>
            <Link
              to="/lieu"
              className="group mt-7 inline-flex min-h-11 items-center gap-3 label-xs text-ink"
            >
              {home.venue.cta}
              <span className="h-px w-8 bg-olive transition-all duration-500 group-hover:w-14" />
            </Link>
          </div>
        </Reveal>
        <div className="img-zoom order-1 h-[54svh] lg:order-2 lg:h-auto">
          <img src={cour} alt={home.venue.alt} loading="lazy" className="size-full object-cover" />
        </div>
      </section>

      {/* Les trois entrées principales */}
      <section className="container-page py-24 sm:py-32">
        <Reveal className="max-w-xl">
          <p className="eyebrow">{home.sections.eyebrow}</p>
          <h2 className="mt-5 display-md text-ink">{home.sections.heading}</h2>
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
          alt={home.gallery.alt}
          loading="lazy"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        {/* Le texte est centré sur toute la hauteur : ici un voile uniforme,
            un peu plus dense, plutôt qu'un dégradé. */}
        <div className="absolute inset-0 z-[-8] bg-ink/45" />

        <Reveal className="container-page py-20 text-center">
          <p className="label-xs text-background/85">{home.gallery.eyebrow}</p>
          <p className="mx-auto mt-6 max-w-xl font-serif text-[1.5rem] leading-snug font-light text-background italic sm:text-[1.9rem]">
            {home.gallery.quote}
          </p>
          <Link
            to="/galerie"
            className="mt-10 inline-block border border-background/45 px-8 py-3.5 label-xs text-background transition-colors hover:bg-background hover:text-ink"
          >
            {home.gallery.cta}
          </Link>
        </Reveal>
      </section>

      {/* Bon à savoir */}
      {/* Instagram du domaine */}
      <section className="border-t border-border/70 bg-sage-soft/30">
        <div className="container-page py-20 sm:py-24">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow">{home.instagram.eyebrow}</p>
              <h2 className="mt-5 display-md text-ink">{home.instagram.heading}</h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                {home.instagram.text}
              </p>
            </div>
            <a
              href="https://www.instagram.com/couventnotredamedespres/"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex w-full items-center justify-center gap-3 border border-olive/50 px-4 py-4 font-display text-[0.75rem] tracking-[0.1em] uppercase text-ink transition-colors hover:bg-olive hover:text-primary-foreground sm:w-fit sm:px-7 sm:py-3.5 sm:text-[0.68rem] sm:tracking-[0.24em]"
            >
              <Instagram className="size-4" strokeWidth={1.2} />
              @couventnotredamedespres
            </a>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { src: parc, alt: home.instagram.alts[0]! },
              { src: bambouseraie, alt: home.instagram.alts[1]! },
              { src: drone, alt: home.instagram.alts[2]! },
              { src: couloir, alt: home.instagram.alts[3]! },
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
          <p className="eyebrow">{home.good.eyebrow}</p>
          <p className="mx-auto mt-6 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
            {home.good.text}
          </p>
          <Link
            to="/faq"
            className="mt-9 inline-block border border-olive/50 px-8 py-3.5 label-xs text-ink transition-colors hover:bg-olive hover:text-primary-foreground"
          >
            {home.good.cta}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
