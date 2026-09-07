/**
 * Le schéma que le site attend d'Airtable.
 *
 * Partagé par deux usages : la page de diagnostic, qui signale une colonne
 * manquante, et le bouton qui la pose. Une seule définition, donc, sinon l'un
 * finirait par ignorer ce que l'autre exige.
 */
export type Field = { name: string; type: string; options?: Record<string, unknown> };

const DATE_ISO = { dateFormat: { name: "iso" } };
const ENTIER = { precision: 0 };
const CASE = { icon: "check", color: "greenBright" };

export const COVOITURAGE_FIELDS: Field[] = [
  { name: "Nom", type: "singleLineText" },
  { name: "Téléphone", type: "singleLineText" },
  { name: "WhatsApp", type: "checkbox", options: CASE },
  { name: "Départ", type: "singleLineText" },
  { name: "Destination", type: "singleLineText" },
  { name: "Date d'arrivée", type: "date", options: DATE_ISO },
  { name: "Heure d'arrivée", type: "number", options: ENTIER },
  { name: "Date de départ", type: "date", options: DATE_ISO },
  { name: "Heure de départ", type: "number", options: ENTIER },
  { name: "Retour vers", type: "singleLineText" },
  { name: "Places aller", type: "number", options: ENTIER },
  { name: "Places retour", type: "number", options: ENTIER },
  { name: "Commentaire", type: "multilineText" },
  { name: "Passagers", type: "multilineText" },
];

export const SEJOURS_FIELDS: Field[] = [
  { name: "Noms", type: "singleLineText" },
  { name: "Hébergement", type: "singleLineText" },
  { name: "Personnes", type: "number", options: ENTIER },
];
