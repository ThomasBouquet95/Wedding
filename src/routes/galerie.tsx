import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import hero from "@/assets/hero.webp";
import facade from "@/assets/facade.webp";
import cour from "@/assets/cour.webp";
import drone from "@/assets/drone.webp";
import parc from "@/assets/parc.webp";
import chambre from "@/assets/chambre.webp";
import bambouseraie from "@/assets/bambouseraie.webp";
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

const photos = [
  { src: hero, alt: "La façade du couvent et sa piscine", span: "sm:row-span-2" },
  { src: facade, alt: "La façade du Couvent Notre-Dame des Prés", span: "" },
  { src: drone, alt: "Vue aérienne du domaine et de son parc", span: "" },
  { src: parc, alt: "Le parc du couvent et ses arbres centenaires", span: "sm:col-span-2" },
  { src: cour, alt: "La cour intérieure et ses arcades, tables dressées", span: "sm:col-span-2" },
  { src: bambouseraie, alt: "La bambouseraie du domaine", span: "" },
  { src: chambre, alt: "Une des chambres du couvent", span: "sm:row-span-2" },
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
        intro="Un avant-goût du lieu et de la lumière de juin, au fil des jardins, du parc et des façades de pierre du couvent."
        image={parc}
        imageAlt="Le parc du Couvent Notre-Dame des Prés"
      />

      <section className="container-page py-16 sm:py-24">
        <div className="grid auto-rows-[220px] grid-cols-1 gap-3 sm:grid-cols-3 sm:auto-rows-[260px]">
          {photos.map((p, i) => (
            <Reveal key={p.alt} delay={i * 60} className={p.span}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Agrandir l'image : ${p.alt}`}
                className="img-zoom size-full"
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="size-full object-cover"
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