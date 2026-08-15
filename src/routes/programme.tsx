import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import cour from "@/assets/cour.webp";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/programme")({
  head: () => ({
    meta: [
      { title: "Le programme — Alexandra & Thomas" },
      {
        name: "description",
        content:
          "Le déroulé du mariage : soirée d'accueil le vendredi 25, cérémonie et dîner le samedi 26 juin 2027, journée libre le dimanche 27.",
      },
      { property: "og:title", content: "Le programme — Alexandra & Thomas" },
      {
        property: "og:description",
        content: "Vendredi 25, samedi 26 et journée libre le dimanche 27 juin 2027.",
      },
      { property: "og:url", content: SITE_URL + "/programme" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/programme" }],
  }),
  component: Page,
});

const days = [
  {
    day: "Vendredi 25 juin",
    subtitle: "Soirée d'accueil",
    note: "Arrivée tranquille, puis la soirée d'accueil, tous ensemble sous les arbres.",
    events: [
      { time: "À partir de 17h", label: "Arrivée et installation" },
      { time: "18h", label: "Soirée d'accueil" },
    ],
  },
  {
    day: "Samedi 26 juin",
    subtitle: "Le grand jour",
    note: "La journée principale : cérémonie dans le parc, puis dîner et soirée dans la cour. Robe longue et costume attendus.",
    events: [
      { time: "16h", label: "Cérémonie" },
      { time: "20h", label: "Dîner et soirée" },
    ],
  },
  {
    day: "Dimanche 27 juin",
    subtitle: "Journée libre",
    note: "Rien d'obligatoire : le lieu reste à votre disposition pour prolonger les festivités, piscine comprise.",
    events: [
      { time: "Toute la journée", label: "Le lieu et la piscine restent à votre disposition" },
    ],
  },
];

function Page() {
  return (
    <>
      <PageHero
        eyebrow="Programme"
        title="Le week-end, jour par jour"
        intro="Les horaires indiqués sont donnés à titre indicatif et seront précisés d'ici le printemps 2027."
        image={cour}
        imageAlt="La cour intérieure du couvent, tables dressées en plein jour"
      />

      <section className="container-page py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          {days.map((d, i) => (
            <Reveal
              key={d.day}
              delay={i * 100}
              className="grid gap-8 border-t border-border py-14 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-16"
            >
              <div className="md:sticky md:top-28 md:self-start">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-[0.68rem] tracking-[0.28em] text-olive">
                    {`0${i + 1}`}
                  </span>
                  <p className="eyebrow">{d.subtitle}</p>
                </div>
                <h2 className="mt-4 font-serif text-3xl leading-tight font-light text-ink sm:text-[2.6rem]">
                  {d.day}
                </h2>
                <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
                  {d.note}
                </p>
              </div>

              <ul className="relative border-l border-border pl-8 sm:pl-10">
                {d.events.map((e) => (
                  <li key={e.label} className="relative pb-10 last:pb-0">
                    <span
                      aria-hidden
                      className="absolute top-[0.55rem] -left-[calc(2rem+3px)] size-[5px] rounded-full bg-olive sm:-left-[calc(2.5rem+3px)]"
                    />
                    <p className="font-display text-[0.68rem] tracking-[0.24em] uppercase text-muted-foreground">
                      {e.time}
                    </p>
                    <p className="mt-2 font-serif text-xl leading-snug font-light text-ink">
                      {e.label}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-8 max-w-5xl border-t border-border pt-10">
          <p className="text-center text-[0.9rem] leading-relaxed text-muted-foreground">
            Les horaires définitifs seront mis à jour sur ce site au printemps 2027.
          </p>
        </Reveal>
      </section>
    </>
  );
}
