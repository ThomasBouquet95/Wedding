import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import { useEffect, useRef, useState } from "react";
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
import couchant from "@/assets/couchant.webp";
import parc from "@/assets/parc.webp";
import { PageHero } from "@/components/page-hero";
import { cn } from "@/lib/utils";
import { translations, useT } from "@/lib/i18n";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/galerie")({
  head: ({ match }) => {
    const p = translations[match.search.lang === "en" ? "en" : "fr"].galerie;
    // La version dans l'autre langue est déclarée en `alternate` : sans quoi
    // les moteurs traiteraient les deux URL comme du contenu dupliqué.
    const canonical =
      match.search.lang === "en" ? SITE_URL + "/galerie?lang=en" : SITE_URL + "/galerie";

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
        { rel: "alternate", hrefLang: "fr", href: SITE_URL + "/galerie" },
        { rel: "alternate", hrefLang: "en", href: SITE_URL + "/galerie?lang=en" },
      ],
    };
  },
  component: Page,
});

/** Les légendes vivent dans le dictionnaire (`galerie.alts`), dans le même
 *  ordre que ce tableau : ici ne restent que la source, l'encombrement dans
 *  la grille et, au besoin, le cadrage. */
const photos = [
  {
    src: bambouseraie,
    span: "sm:row-span-2",
  },
  { src: facade, span: "" },
  { src: piscine, span: "" },
  {
    src: reception,
    span: "sm:col-span-2",
  },
  {
    src: cour,
    span: "sm:row-span-2",
  },
  { src: oliviers, span: "" },
  { src: arcades, span: "" },
  {
    src: drone,
    span: "sm:row-span-2",
  },
  {
    src: courHaute,
    span: "sm:col-span-2",
  },
  { src: soiree, span: "" },
  {
    src: diner,
    span: "sm:row-span-2",
  },
  { src: salle, span: "sm:col-span-2" },
  { src: couloir, span: "" },
  { src: toits, span: "" },
  {
    src: parc,
    span: "",
    // Sans cela, la vignette ne montre que la cime des arbres.
    position: "object-bottom",
  },
  { src: couchant, span: "sm:col-span-2" },
  { src: chapelle, span: "sm:col-span-2" },
];

function Page() {
  const t = useT();
  const alts = t.galerie.alts;
  const [active, setActive] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);

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
        eyebrow={t.galerie.eyebrow}
        title={t.galerie.heading}
        intro={t.galerie.intro}
        image={reception}
        imageAlt={t.galerie.heroAlt}
      />

      <section className="container-page py-16 sm:py-24">
        {/* `grid-flow-dense` : les vignettes sur deux rangées ou deux colonnes
            laissent sinon des trous, que les images suivantes viennent combler
            en remontant. L'ordre de lecture s'en trouve légèrement bousculé,
            sans conséquence pour une galerie. */}
        <div className="grid auto-rows-[220px] grid-flow-dense grid-cols-1 gap-3 sm:auto-rows-[260px] sm:grid-cols-3">
          {photos.map((p, i) => (
            <Reveal key={i} delay={i * 60} className={p.span}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${t.galerie.enlarge} : ${alts[i]}`}
                className="img-zoom size-full"
              >
                <img
                  src={p.src}
                  alt={alts[i]}
                  loading="lazy"
                  className={cn("size-full object-cover", p.position)}
                />
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {active !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alts[active]}
          className="fixed inset-0 z-[60] flex flex-col bg-ink/95"
          onClick={() => setActive(null)}
          onTouchStart={(e) => {
            touchStart.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            // Balayage horizontal : sur un téléphone, c'est le geste attendu
            // pour passer d'une image à l'autre — les flèches du clavier ne
            // servent qu'au bureau.
            const start = touchStart.current;
            const end = e.changedTouches[0]?.clientX;
            touchStart.current = null;
            if (start == null || end == null || Math.abs(end - start) < 50) return;
            setActive((i) =>
              end < start
                ? ((i ?? 0) + 1) % photos.length
                : ((i ?? 0) - 1 + photos.length) % photos.length,
            );
          }}
        >
          {/* Barre haute opaque : la croix se détachait mal sur les images
              claires, et sa cible tactile faisait moins de 44 px. */}
          <div
            className="flex shrink-0 items-center justify-between px-4 py-2"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="label-xs text-background/70">
              {active + 1} / {photos.length}
            </p>
            <button
              type="button"
              aria-label={t.galerie.close}
              className="-mr-2 inline-flex size-12 items-center justify-center text-background"
              onClick={() => setActive(null)}
            >
              <X className="size-6" strokeWidth={1.1} />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center px-3 pb-3">
            <img
              src={photos[active]!.src}
              alt={alts[active]}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <p className="shrink-0 px-6 pb-[max(1rem,env(safe-area-inset-bottom))] text-center text-[0.85rem] leading-relaxed text-background/70">
            {alts[active]}
          </p>
        </div>
      ) : null}
    </>
  );
}
