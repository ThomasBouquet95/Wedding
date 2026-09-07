import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { diagnoseFn } from "@/lib/diagnostic.server";

/**
 * Un bilan de santé de la liaison Airtable, à l'usage des mariés.
 *
 * Page volontairement absente du menu et interdite aux moteurs de recherche :
 * elle ne sert qu'à répondre à « pourquoi le tableau de covoiturage ne
 * s'affiche-t-il pas ? » sans avoir à fouiller les journaux de Vercel. Elle ne
 * divulgue jamais le jeton, seulement s'il est défini et ce qu'Airtable
 * répond.
 */
export const Route = createFileRoute("/diagnostic")({
  head: () => ({
    meta: [{ title: "Diagnostic — Alexandra & Thomas" }, { name: "robots", content: "noindex" }],
  }),
  component: Page,
});

type Report = Awaited<ReturnType<typeof diagnoseFn>>;

function Page() {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    diagnoseFn()
      .then(setReport)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  const ok = (v: boolean) => (v ? "✅" : "❌");

  return (
    <section className="container-narrow py-20">
      <p className="eyebrow">Diagnostic</p>
      <h1 className="mt-5 display-md text-ink">La liaison Airtable</h1>
      <p className="mt-5 text-[0.95rem] leading-relaxed text-muted-foreground">
        Cette page n'est pas listée dans le menu. Elle dit si le site sait parler à Airtable, et ce
        qu'Airtable répond pour chacune des deux tables.
      </p>

      {error ? (
        <p className="mt-10 border-l-2 border-clay bg-clay-soft px-4 py-3 text-[0.9rem] text-clay">
          La fonction serveur elle-même a échoué : {error}
        </p>
      ) : report === null ? (
        <p className="mt-10 text-[0.9rem] text-muted-foreground">Vérification…</p>
      ) : (
        <div className="mt-10 space-y-8">
          <dl className="grid gap-3 border-y border-border py-6 text-[0.92rem] sm:grid-cols-[auto_1fr] sm:gap-x-8">
            <dt className="text-olive">Jeton d'accès</dt>
            <dd className="text-ink">
              {ok(report.tokenDefini)}{" "}
              {report.tokenDefini
                ? `défini (${report.tokenLongueur} caractères)`
                : "AIRTABLE_TOKEN absent des variables Vercel"}
            </dd>
            <dt className="text-olive">Identifiant de base</dt>
            <dd className="text-ink">
              {ok(report.baseDefinie)} {report.base || "AIRTABLE_BASE absent"}
            </dd>
          </dl>

          <div>
            <h2 className="font-display text-[0.72rem] tracking-[0.24em] uppercase text-ink">
              Les tables
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[28rem] text-left text-[0.9rem]">
                <thead className="font-display text-[0.66rem] tracking-[0.18em] uppercase text-olive">
                  <tr>
                    <th className="border-b border-border py-2 pr-4">Table</th>
                    <th className="border-b border-border py-2 pr-4">HTTP</th>
                    <th className="border-b border-border py-2 pr-4">Réponse</th>
                    <th className="border-b border-border py-2">Lignes lues</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {report.tables.map((t) => (
                    <tr key={t.table}>
                      <td className="border-b border-border/60 py-3 pr-4 text-ink">{t.table}</td>
                      <td className="border-b border-border/60 py-3 pr-4">{t.status || "—"}</td>
                      <td
                        className={`border-b border-border/60 py-3 pr-4 ${
                          t.code === "OK" ? "text-olive" : "text-clay"
                        }`}
                      >
                        {t.code === "OK" ? "✅ OK" : `❌ ${t.code}`}
                      </td>
                      <td className="border-b border-border/60 py-3">{t.rows ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-border pt-6 text-[0.85rem] leading-relaxed text-muted-foreground">
            <p className="font-display text-[0.66rem] tracking-[0.2em] uppercase text-olive">
              Que faire selon la réponse
            </p>
            <ul className="mt-3 space-y-1.5">
              <li>
                <strong className="text-ink">NON_CONFIGURE</strong> — ajoutez `AIRTABLE_TOKEN` et
                `AIRTABLE_BASE` dans Vercel, puis redéployez.
              </li>
              <li>
                <strong className="text-ink">UNAUTHORIZED / INVALID_API_KEY</strong> — le jeton est
                faux ou expiré.
              </li>
              <li>
                <strong className="text-ink">NOT_FOUND</strong> — l'identifiant de base est faux, ou
                le jeton ne couvre pas cette base.
              </li>
              <li>
                <strong className="text-ink">TABLE_NOT_FOUND</strong> — la table n'existe pas, ou
                son nom diffère (majuscules et accents comptent).
              </li>
              <li>
                <strong className="text-ink">NOT_AUTHORIZED</strong> — le jeton manque d'une
                autorisation : il lui faut `data.records:read` et `data.records:write`.
              </li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
