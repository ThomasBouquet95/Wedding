import { saveSejourFn, sejoursOpenFn } from "./sejours.server";
import { stayNames } from "./hebergements";

/**
 * Où chaque invité dort, et à combien.
 *
 * Le samedi soir, un service de retour est prévu vers les hébergements les
 * plus proches. Pour le dimensionner il faut savoir qui dort où : c'est tout
 * l'objet de ce court sondage, proposé au bout de quelques pages consultées
 * plutôt qu'à la première seconde.
 */
export type SejourInput = {
  name: string;
  accommodation: string;
  people: number;
};

/** Le choix proposé : nos dix adresses, puis les deux cas de figure restants. */
export const OTHER = "__autre__";
export const UNKNOWN = "__inconnu__";

export const accommodationChoices: readonly string[] = stayNames;

export async function createSejour(sejour: SejourInput): Promise<void> {
  await saveSejourFn({ data: sejour });
}

/** Si Airtable n'est pas configuré, inutile de solliciter les invités : leur
 *  réponse n'irait nulle part. */
export function sejoursOpen(): Promise<boolean> {
  return sejoursOpenFn();
}

/* ------------------------------------------------------------------ *
 * Mémoire locale
 * ------------------------------------------------------------------ */

const COUNTER = "at:vues";
const ANSWERED = "at:sejour";
/** Nombre de pages consultées avant de se permettre la question. */
export const THRESHOLD = 5;

/**
 * `localStorage` peut lever — navigation privée, cookies bloqués — et vaut
 * mieux qu'un plantage : en cas d'échec, on considère simplement que l'invité
 * n'a rien vu et rien répondu, donc on ne l'importune pas.
 */
function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* rien à faire : le sondage se contentera de ne pas réapparaître */
  }
}

/** Compte une page de plus et renvoie le total. */
export function countVisit(): number {
  const next = Number(read(COUNTER) ?? "0") + 1;
  write(COUNTER, String(next));
  return next;
}

export function alreadyAnswered(): boolean {
  return read(ANSWERED) !== null;
}

/** La question ne se pose qu'une fois, qu'on y réponde ou qu'on l'écarte. */
export function remember(answer: "envoye" | "refuse"): void {
  write(ANSWERED, answer);
}
