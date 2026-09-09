import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import { Compass, Phone, Scissors, ShoppingBag, UtensilsCrossed } from "lucide-react";
import oliviers from "@/assets/oliviers.webp";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { translations, useT } from "@/lib/i18n";
import { regionGroups, telHref, type RegionGroupId } from "@/lib/region";

export const Route = createFileRoute("/region")({
  head: ({ match }) => {
    const p = translations[match.search.lang === "en" ? "en" : "fr"].region;
    // La version dans l'autre langue est déclarée en `alternate` : sans quoi
    // les moteurs traiteraient les deux URL comme du contenu dupliqué.
    const canonical =
      match.search.lang === "en" ? SITE_URL + "/region?lang=en" : SITE_URL + "/region";

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
        { rel: "alternate", hrefLang: "fr", href: SITE_URL + "/region" },
        { rel: "alternate", hrefLang: "en", href: SITE_URL + "/region?lang=en" },
      ],
    };
  },
  component: Page,
});

/** Une icône par rubrique. Les libellés, eux, viennent du dictionnaire. */
const ICONS: Record<RegionGroupId, typeof UtensilsCrossed> = {
  dejeuner: UtensilsCrossed,
  achats: ShoppingBag,
  beaute: Scissors,
  activites: Compass,
};

function Page() {
  const t = useT();
  const r = t.region;

  return (
    <>
      <PageHero
        eyebrow={r.eyebrow}
        title={r.heading}
        intro={r.intro}
        image={oliviers}
        imageAlt={r.heroAlt}
      />

      <section className="container-page py-16 sm:py-24">
        {regionGroups.map((group, gi) => {
          const g = r.groups[group.id];
          const Icon = ICONS[group.id];

          return (
            <div
              key={group.id}
              className={
                gi === 0
                  ? "grid gap-10 md:grid-cols-[minmax(0,0.5fr)_minmax(0,1.5fr)] md:gap-16"
                  : "mt-16 grid gap-10 border-t border-border pt-16 md:mt-20 md:grid-cols-[minmax(0,0.5fr)_minmax(0,1.5fr)] md:gap-16 md:pt-20"
              }
            >
              <Reveal>
                <div className="md:sticky md:top-28">
                  <Icon className="size-5 text-olive" strokeWidth={1.1} />
                  <h2 className="mt-5 font-serif text-2xl leading-tight font-light text-ink">
                    {g.title}
                  </h2>
                  <p className="mt-4 max-w-xs text-[0.88rem] leading-relaxed text-muted-foreground">
                    {g.note}
                  </p>
                </div>
              </Reveal>

              {/* Une ligne par adresse : on parcourt un annuaire, chaque
                  donnée toujours à la même place. */}
              <ul className="divide-y divide-border border-t border-border">
                {group.items.map((item, i) => (
                  <Reveal as="li" key={item.id} delay={i * 50} className="py-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                      <h3 className="font-serif text-[1.3rem] leading-snug font-light text-ink">
                        {item.name}
                      </h3>
                      {item.price || item.minutes ? (
                        <p className="font-display text-[0.66rem] tracking-[0.16em] whitespace-nowrap uppercase text-olive">
                          {item.price}
                          {item.price && item.minutes ? " · " : null}
                          {item.minutes ? `${item.minutes} min ${r.fromCouvent}` : null}
                        </p>
                      ) : null}
                    </div>

                    {/* Une note vide = le guide ne dit rien de plus. */}
                    {r.notes[item.id as keyof typeof r.notes] ? (
                      <p className="mt-2 text-[0.92rem] leading-relaxed text-muted-foreground">
                        {r.notes[item.id as keyof typeof r.notes]}
                      </p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.85rem] text-muted-foreground/80">
                      {item.town ? (
                        <span>
                          {item.address ? `${item.address} · ` : null}
                          {item.town}
                        </span>
                      ) : null}
                      {item.phone ? (
                        <a
                          href={telHref(item.phone)}
                          className="inline-flex min-h-8 items-center gap-2 text-ink transition-colors hover:text-olive"
                        >
                          <Phone className="size-3.5 shrink-0 text-olive" strokeWidth={1.3} />
                          {item.phone}
                        </a>
                      ) : null}
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          );
        })}

        <Reveal className="mt-16 border-t border-border pt-10">
          <p className="max-w-2xl text-[0.85rem] leading-relaxed text-muted-foreground">
            {r.source}
          </p>
        </Reveal>
      </section>
    </>
  );
}
