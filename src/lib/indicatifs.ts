/**
 * Les indicatifs téléphoniques proposés au formulaire de covoiturage.
 *
 * Le numéro était saisi d'un bloc et l'indicatif s'oubliait : un « 06 12 … »
 * ne permet ni d'ouvrir WhatsApp ni d'appeler depuis un téléphone étranger, et
 * une partie des invités arrive de Suisse, du Royaume-Uni et d'ailleurs. En
 * séparant le pays du numéro, l'oubli devient impossible.
 *
 * La liste s'ouvre sur les pays d'où viennent les invités, puis suit l'ordre
 * alphabétique. Elle n'a pas à être exhaustive : « Autre » laisse saisir
 * l'indicatif à la main.
 */
export type Indicatif = { code: string; label: string };

export const OTHER_CODE = "autre";

export const INDICATIFS: readonly Indicatif[] = [
  { code: "+33", label: "France +33" },
  { code: "+41", label: "Suisse +41" },
  { code: "+44", label: "Royaume-Uni +44" },
  { code: "+32", label: "Belgique +32" },
  { code: "+49", label: "Allemagne +49" },
  { code: "+34", label: "Espagne +34" },
  { code: "+39", label: "Italie +39" },
  { code: "+352", label: "Luxembourg +352" },
  { code: "+31", label: "Pays-Bas +31" },
  { code: "+351", label: "Portugal +351" },
  { code: "+1", label: "États-Unis / Canada +1" },
  { code: "+43", label: "Autriche +43" },
  { code: "+45", label: "Danemark +45" },
  { code: "+353", label: "Irlande +353" },
  { code: "+46", label: "Suède +46" },
  { code: "+47", label: "Norvège +47" },
  { code: "+48", label: "Pologne +48" },
  { code: "+30", label: "Grèce +30" },
  { code: "+420", label: "Tchéquie +420" },
  { code: "+212", label: "Maroc +212" },
  { code: "+216", label: "Tunisie +216" },
  { code: "+61", label: "Australie +61" },
  { code: "+65", label: "Singapour +65" },
  { code: "+971", label: "Émirats arabes unis +971" },
];

/** Recompose le numéro complet, tel qu'il sera enregistré et affiché. */
export function joinPhone(code: string, local: string): string {
  const digits = local.trim().replace(/^0+/, "");
  return `${code.trim()} ${digits}`.trim();
}

/**
 * Sépare un numéro enregistré en indicatif et partie locale, pour rouvrir un
 * trajet à la modification. L'indicatif le plus long gagne : sans quoi « +1 »
 * emporterait « +351 ».
 */
export function splitPhone(phone: string): { code: string; local: string } {
  const trimmed = phone.trim();
  const known = [...INDICATIFS]
    .map((i) => i.code)
    .sort((a, b) => b.length - a.length)
    .find((c) => trimmed.startsWith(c));
  if (known) return { code: known, local: trimmed.slice(known.length).trim() };
  const other = /^(\+\d{1,4})\s*(.*)$/.exec(trimmed);
  if (other) return { code: other[1] ?? "", local: (other[2] ?? "").trim() };
  return { code: "+33", local: trimmed };
}
