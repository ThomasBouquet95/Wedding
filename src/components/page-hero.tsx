import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  image: string;
  imageAlt: string;
}) {
  return (
    <section className="relative isolate flex min-h-[62svh] items-end overflow-hidden pt-28 pb-12 sm:min-h-[70svh] sm:pb-16">
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 -z-10 size-full object-cover"
        loading="eager"
      />
      {/* Un seul voile, sombre, et seulement là où le titre se pose. Le voile
          blanc qui le précédait éclaircissait la photo pour la « stabiliser »,
          puis ce dégradé la rassombrissait pour rendre le texte lisible : les
          deux s'annulaient, en ne laissant que la perte de contraste. */}
      <div className="absolute inset-0 z-[-8] bg-gradient-to-t from-ink/88 from-0% via-ink/68 via-45% to-transparent to-82%" />

      <div className="container-page">
        <div className="max-w-2xl">
          <p className="label-xs text-background">{eyebrow}</p>
          <div className="mt-5 h-px w-14 bg-background/50" />
          <h1 className="mt-6 display-lg text-background">{title}</h1>
          {intro ? (
            <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-background/85">
              {intro}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
