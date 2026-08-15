import { Link } from "@tanstack/react-router";
import olive from "@/assets/olive-sprig.webp";
import { navLinks } from "@/components/site-header";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-sage-soft/45">
      <div className="container-page py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-start">
          <div>
            <img
              src={olive}
              alt=""
              aria-hidden="true"
              data-tone="raw"
              loading="lazy"
              width={420}
              height={420}
              className="h-11 w-auto opacity-70"
            />
            <p className="mt-6 font-serif text-3xl font-light text-ink">
              Alexandra <span className="text-olive">&amp;</span> Thomas
            </p>
            <p className="mt-3 label-xs text-muted-foreground">
              25 — 26 juin 2027 · Reillanne, Provence
            </p>
            <p className="mt-6 max-w-sm text-[0.9rem] leading-relaxed text-muted-foreground">
              Couvent Notre-Dame des Prés, 04110 Reillanne. Ce site rassemble toutes les
              informations pratiques du week-end.
            </p>
          </div>

          <nav aria-label="Pages du site" className="grid grid-cols-2 gap-x-8 gap-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group inline-flex min-h-11 items-center label-xs text-muted-foreground transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://www.instagram.com/couventnotredamedespres/"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-11 items-center label-xs text-muted-foreground transition-colors hover:text-ink"
            >
              Instagram du lieu
            </a>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs tracking-[0.14em] text-muted-foreground/80">
            Mise à jour au printemps 2027
          </p>
          <p className="text-xs tracking-[0.14em] text-muted-foreground/80">A &amp; T · 2027</p>
        </div>
      </div>
    </footer>
  );
}
