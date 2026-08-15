import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import bambouseraie from "@/assets/bambouseraie.webp";
import cour from "@/assets/cour.webp";
import drone from "@/assets/drone.webp";
import reception from "@/assets/reception.webp";
import arcades from "@/assets/arcades.webp";
import piscine from "@/assets/piscine.webp";
import oliviers from "@/assets/oliviers.webp";
import diner from "@/assets/diner.webp";
import salle from "@/assets/salle.webp";
import couloir from "@/assets/couloir.webp";
import soiree from "@/assets/soiree.webp";
import toits from "@/assets/toits.webp";
import chapelle from "@/assets/chapelle.webp";
import courHaute from "@/assets/cour-haute.webp";
import facade from "@/assets/facade.webp";
import parc from "@/assets/parc.webp";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/galerie")({
  head: () => ({
    meta: [
      { title: "Galerie — Alexandra & Thomas" },
      {
        name: "description",
        content:
          "Le domaine, ses jardins et ses intérieurs : quelques images du Couvent Notre-Dame des Prés.",
      },
      { property: "og:title", content: "Galerie — Alexandra & Thomas" },
      { property: "og:description", content: "Le domaine, ses jardins et ses intérieurs." },
      { property: "og:url", content: SITE_URL + "/galerie" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/galerie" }],
  }),
  component: Page,
});

/** `span` fait respirer la grille : les images verticales les plus fortes
 *  occupent deux rangées, les panoramiques deux colonnes. */
const photos = [
  {
    src: bambouseraie,
    alt: "L'allée de cérémonie, chaises alignées sous les bambous",
    span: "sm:row-span-2",
  },
  { src: facade, alt: "La façade du Couvent Notre-Dame des Prés en plein jour", span: "" },
  { src: piscine, alt: "La piscine du domaine, vue à la verticale", span: "" },
  {
    src: reception,
    alt: "La réception devant la façade, sous les voiles d'ombrage",
    span: "sm:col-span-2",
  },
  {
    src: cour,
    alt: "Le cloître, longues tables dressées sous les guirlandes",
    span: "sm:row-span-2",
  },
  { src: oliviers, alt: "La façade bordée d'oliviers et de lavandes", span: "" },
  { src: arcades, alt: "Les arcades de pierre ouvrant sur la cour", span: "" },
  {
    src: drone,
    alt: "Le domaine vu du ciel au crépuscule, la cour illuminée",
    span: "sm:row-span-2",
  },
  {
    src: courHaute,
    alt: "La cour carrée et ses tables rondes, vues du ciel",
    span: "sm:col-span-2",
  },
  { src: soiree, alt: "Le salon de bambou au couchant", span: "" },
  {
    src: diner,
    alt: "Le dîner dressé dans le cloître, vu depuis les étages",
    span: "sm:row-span-2",
  },
  { src: salle, alt: "La salle voûtée et son bar, sous les guirlandes", span: "sm:col-span-2" },
  { src: couloir, alt: "Un couloir du couvent, oliviers en pot et voûtes de pierre", span: "" },
  { src: toits, alt: "Les toitures du couvent et la vallée", span: "" },
  { src: parc, alt: "La piscine et ses transats, au pied des grands arbres", span: "" },
  { src: chapelle, alt: "La façade de la chapelle du couvent", span: "sm:col-span-2" },
];

function Page() {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => ((i ?? 0) + 1) % photos.length);
      if (e.key === "ArrowLeft") setActive((i) => ((i ?? 0) - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <>
      <PageHero
        eyebrow="Galerie"
        title="Quelques images"
        intro="Un avant-goût du lieu et de la lumière de juin : le cloître, la bambouseraie, la piscine et les façades de pierre."
        image={reception}
        imageAlt="La réception devant la façade du couvent, au couchant"
      />

      <section className="container-page py-16 sm:py-24">
        {/* `grid-flow-dense` : les vignettes sur deux rangées ou deux colonnes
            laissent sinon des trous, que les images suivantes viennent combler
            en remontant. L'ordre de lecture s'en trouve légèrement bousculé,
            sans conséquence pour une galerie. */}
        <div className="grid auto-rows-[220px] grid-flow-dense grid-cols-1 gap-3 sm:auto-rows-[260px] sm:grid-cols-3">
          {photos.map((p, i) => (
            <Reveal key={p.alt} delay={i * 60} className={p.span}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Agrandir l'image : ${p.alt}`}
                className="img-zoom size-full"
              >
                <img src={p.src} alt={p.alt} loading="lazy" className="size-full object-cover" />
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {active !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photos[active]!.alt}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-4"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            aria-label="Fermer"
            className="absolute top-6 right-6 text-background"
            onClick={() => setActive(null)}
          >
            <X className="size-6" strokeWidth={1.1} />
          </button>
          <img
            src={photos[active]!.src}
            alt={photos[active]!.alt}
            className="max-h-[86vh] max-w-full object-contain"
          />
        </div>
      ) : null}
    </>
  );
}
