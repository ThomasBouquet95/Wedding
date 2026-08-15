#!/usr/bin/env python3
"""
Étalonnage photographique du site.

Les photographies viennent de sources différentes et n'ont ni la même
exposition ni le même contraste. Les uniformiser par un filtre CSS unique est
impossible : un même `brightness()` éclaircit correctement une photo sombre et
brûle une photo déjà claire. Le calage se fait donc ici, image par image, avant
le build — le CSS n'a plus qu'à ne rien abîmer.

Chaque image est rapprochée de repères tonaux communs (point noir, point blanc,
luminance moyenne), avec une épaule douce dans les hautes lumières : les blancs
se tassent sous un plafond au lieu de brûler, là où une multiplication brutale
écrête et détruit le détail.

« Rapprochée », pas « alignée » : les photographies viennent de photographes
différents et sont déjà étalonnées. Les caler toutes sur la même luminance
effacerait ce qui fait leur intérêt — une vue au crépuscule doit rester plus
sombre qu'un couloir en plein midi. `STRENGTH` règle donc la part du chemin
parcourue vers la cible ; le reste de l'écart est du parti pris, pas un défaut.

    python3 scripts/grade-photos.py

Lit `src/assets/source/*.webp` (les originaux, jamais modifiés) et écrit les
versions étalonnées dans `src/assets/`. Idempotent : relancer le script
repart toujours des originaux.
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "src" / "assets" / "source"
OUTPUT_DIR = ROOT / "src" / "assets"

# Sortie : les sources sont conservées en pleine définition, mais le site n'a
# besoin que de ces dimensions. 1500 px et qualité 78 tiennent la galerie
# entière sous ~3,5 Mo, chargée en différé, sans ramollir les pleines largeurs.
MAX_OUTPUT_EDGE = 1500
WEBP_QUALITY = 78

# Les images affichées en pleine largeur sont recadrées par `object-cover` sur
# des zones bien plus grandes que les vignettes : les réduire à 1500 px les
# rendait floues sur un écran de téléphone à 3× (jusqu'à 2,9 fois agrandies).
# Elles gardent donc leur définition d'origine et une qualité plus élevée.
FULL_BLEED = {
    "hero.webp",
    "hero-mobile.webp",
    "reception.webp",
    "bambouseraie.webp",
    "parc.webp",
    "cour.webp",
    "couloir.webp",
    "drone.webp",
    "facade-piscine.webp",
}
FULL_BLEED_QUALITY = 84

# Les illustrations détourées (logos, rameau d'olivier) n'ont rien à voir avec
# la photographie : les étalonner écraserait leur transparence et leur trait.
SKIP = {"olive-sprig.webp"}

# --- Repères de l'étalonnage -------------------------------------------------
# Part du chemin parcourue vers les cibles ci-dessous. 1 = normalisation
# complète (les photos se ressemblent, mais l'heure de la journée disparaît),
# 0 = aucune correction. À 0,35 les écarts criants se resserrent et les
# intentions du photographe survivent.
STRENGTH = 0.35
# Luminance visée, en lumière linéaire. Volontairement claire (ambiance
# estivale, pierre blonde) mais loin de la saturation.
TARGET_MEAN = 0.44
# Percentiles servant de points d'ancrage. Le 1ᵉ / 99ᵉ ignore les quelques
# pixels extrêmes (un reflet, une ombre bouchée) qui fausseraient le calage.
BLACK_PCT, WHITE_PCT = 1.0, 99.0
# Le point noir est volontairement décollé de zéro : les photographies de
# référence ont des ombres « mates », lavées, jamais bouchées — c'est ce qui
# donne le rendu argentique plutôt que numérique.
TARGET_BLACK, TARGET_WHITE = 0.030, 0.94
# Épaule : au-delà de ce seuil, la courbe se comprime au lieu d'écrêter.
SHOULDER = 0.72
# Plafond de cette compression. Sous 1 volontairement : en 8 bits, une valeur
# linéaire de 0,99 est déjà encodée 255 en sRGB, donc viser 1 laisserait
# réapparaître du blanc pur dans les ciels.
CEILING = 0.96
# Désaturation quasi nulle : ces photographies sont déjà sourdes, en pousser
# davantage les viderait.
SATURATION = 0.96
# Réchauffement à peine perceptible : la lumière ambrée est déjà dans les
# fichiers, il n'y a rien à ajouter.
WARMTH = np.array([1.008, 1.001, 0.991], dtype=np.float32)

LUMA = np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)


def srgb_to_linear(x):
    return np.where(x <= 0.04045, x / 12.92, ((x + 0.055) / 1.055) ** 2.4)


def linear_to_srgb(x):
    x = np.clip(x, 0.0, 1.0)
    return np.where(x <= 0.0031308, x * 12.92, 1.055 * x ** (1 / 2.4) - 0.055)


def soft_shoulder(x, knee, ceiling):
    """Compresse [knee, ∞) dans [knee, ceiling) au lieu d'écrêter.

    En dessous du seuil l'image est laissée intacte — l'essentiel du sujet ne
    bouge pas. Au-dessus, la courbe tend vers le plafond sans jamais
    l'atteindre, ce qui préserve le modelé d'un ciel ou d'un mur en plein
    soleil.
    """
    out = x.copy()
    high = x > knee
    span = ceiling - knee
    out[high] = knee + span * np.tanh((x[high] - knee) / span)
    return out


def grade(image):
    rgb = np.asarray(image.convert("RGB"), dtype=np.float32) / 255.0
    lin = srgb_to_linear(rgb)

    luma = lin @ LUMA

    # 1. Rapprochement des points noir et blanc : c'est ce calage qui resserre
    #    les écarts les plus visibles d'une photo à l'autre.
    black = np.percentile(luma, BLACK_PCT)
    white = np.percentile(luma, WHITE_PCT)
    if white - black < 1e-4:
        return image
    stretched = (lin - black) / (white - black)
    stretched = stretched * (TARGET_WHITE - TARGET_BLACK) + TARGET_BLACK
    lin = np.clip(lin + (stretched - lin) * STRENGTH, 0.0, None)

    # 2. Exposition rapprochée de la luminance visée, du même pas partiel. Le
    #    gain est borné pour ne pas transformer une photo de nuit en plein jour.
    mean = float((lin @ LUMA).mean())
    if mean > 1e-4:
        gain = np.clip(TARGET_MEAN / mean, 0.6, 1.7)
        lin *= 1.0 + (gain - 1.0) * STRENGTH

    # 3. Désaturation et réchauffement, appliqués sur une base déjà homogène.
    grey = (lin @ LUMA)[..., None]
    lin = grey + (lin - grey) * SATURATION
    lin *= WARMTH

    # 4. Épaule douce, en dernier : elle doit voir les valeurs définitives.
    #    Placée avant la désaturation ou le réchauffement, ces étapes
    #    repousseraient ensuite des canaux au-dessus de 1 et l'écrêtage
    #    qu'elle sert à éviter réapparaîtrait.
    lin = soft_shoulder(lin, SHOULDER, CEILING)

    return Image.fromarray((linear_to_srgb(lin) * 255.0).round().astype(np.uint8))


def stats(image):
    a = np.asarray(image.convert("RGB"), dtype=np.float32) / 255.0
    luma = a @ LUMA
    return luma.mean(), float((a >= 0.999).any(axis=2).mean() * 100)


def main():
    if not SOURCE_DIR.is_dir():
        sys.exit(f"Dossier source introuvable : {SOURCE_DIR}")

    sources = sorted(SOURCE_DIR.glob("*.webp"))
    if not sources:
        sys.exit(f"Aucune image dans {SOURCE_DIR}")

    print(f"{'image':24}{'L avant':>9}{'L après':>9}{'brûlé':>8}")
    for path in sources:
        image = Image.open(path)
        if path.name in SKIP:
            print(f"{path.name:24}{'—':>9}{'ignorée':>9}{'—':>8}")
            continue

        before, _ = stats(image)
        graded = grade(image)
        after, clipped = stats(graded)

        full_bleed = path.name in FULL_BLEED
        if not full_bleed and max(graded.size) > MAX_OUTPUT_EDGE:
            graded.thumbnail((MAX_OUTPUT_EDGE, MAX_OUTPUT_EDGE), Image.LANCZOS)
        quality = FULL_BLEED_QUALITY if full_bleed else WEBP_QUALITY
        graded.save(OUTPUT_DIR / path.name, "WEBP", quality=quality, method=6)
        print(f"{path.name:24}{before:9.2f}{after:9.2f}{clipped:7.1f}%")


if __name__ == "__main__":
    main()
