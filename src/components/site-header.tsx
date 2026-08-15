import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const navLinks = [
  { to: "/", label: "Accueil", hint: "Le week-end en un regard" },
  { to: "/programme", label: "Programme", hint: "Les trois journées" },
  { to: "/lieu", label: "Le lieu", hint: "Couvent Notre-Dame des Prés" },
  { to: "/informations", label: "Accès & infos", hint: "Venir, dress code, parking" },
  { to: "/hebergements", label: "Hébergements", hint: "Où dormir alentour" },
  { to: "/galerie", label: "Galerie", hint: "Le domaine en images" },
  { to: "/faq", label: "Questions", hint: "Les réponses utiles" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || !onHome;

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-background focus:px-4 focus:py-2 focus:label-xs"
      >
        Aller au contenu
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-700",
          solid
            ? "border-b border-border/60 bg-background/90 backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-ink/60 via-ink/25 to-transparent",
        )}
      >
        <div className="container-page grid h-[4.25rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:h-[5.25rem] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <Link
            to="/"
            aria-label="Alexandra & Thomas — accueil"
            className={cn(
              "-mx-2 inline-flex min-h-11 min-w-0 items-center px-2 font-serif text-lg leading-none tracking-[0.2em] transition-colors lg:justify-self-start",
              solid ? "text-ink" : "text-background",
            )}
          >
            A<span className={solid ? "text-olive" : "text-background/70"}>&amp;</span>T
          </Link>

          <nav className="hidden items-center gap-8 lg:flex lg:justify-self-center">
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "group relative label-xs whitespace-nowrap transition-colors",
                  solid
                    ? "text-muted-foreground hover:text-ink"
                    : "text-background/80 hover:text-background",
                )}
                activeProps={{ className: solid ? "text-ink" : "text-background" }}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 transition-all duration-500 group-hover:w-full",
                    solid ? "bg-olive/70" : "bg-background/70",
                  )}
                />
              </Link>
            ))}
          </nav>

          <p
            className={cn(
              "hidden label-xs transition-colors lg:block lg:justify-self-end",
              solid ? "text-muted-foreground" : "text-background/80",
            )}
          >
            25 — 26 · 06 · 2027
          </p>

          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "group -mr-2 flex min-h-11 items-center gap-3 justify-self-end px-2 py-2 lg:hidden",
              solid ? "text-ink" : "text-background",
            )}
          >
            <span className="label-xs">{open ? "Fermer" : "Menu"}</span>
            <span className="flex w-6 flex-col items-end gap-[5px]">
              <span
                className={cn(
                  "h-px w-6 bg-current transition-transform duration-500",
                  open && "translate-y-[6px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "h-px bg-current transition-all duration-500",
                  open ? "w-6 -translate-y-[6px] -rotate-45" : "w-4",
                )}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Plein écran mobile : navigation lisible et hiérarchisée */}
      <div
        id="menu-mobile"
        inert={!open}
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 bg-background transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <nav className="container-page flex h-full flex-col justify-center pt-20 pb-10">
          {navLinks.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${120 + i * 45}ms` : "0ms" }}
              className={cn(
                "border-b border-border/60 py-4 transition-all duration-500 last:border-b-0",
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
              activeProps={{ className: "text-ink" }}
            >
              <span className="block font-serif text-[1.6rem] leading-none font-light text-ink">
                {link.label}
              </span>
              <span className="mt-2 block text-[0.8rem] text-muted-foreground">{link.hint}</span>
            </Link>
          ))}
          <p className="mt-8 label-xs text-olive">Reillanne · Provence</p>
        </nav>
      </div>
    </>
  );
}
