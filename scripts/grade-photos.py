#!/usr/bin/env python3
"""
Étalonnage photographique du site.

Les photographies viennent de sources différentes et n'ont ni la même
exposition ni le même contraste. Les uniformiser par un filtre CSS unique est
impossible : un même `brightness()` éclaircit correctement une photo sombre et
brûle une photo déjà claire. Le calage se fait donc ici, image par image, avant
le build — le CSS n'a plus qu'à ne rien abîmer.

Chaque image est ramenée aux mêmes repères tonaux (point noir, point blanc,
luminance moyenne), avec une épaule douce dans les hautes lumières : les blancs
se tassent sous un plafond au lieu de brûler, là où une multiplication brutale
écrête et détruit le détail.

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

# Qualité WebP : 86 place le poids total au niveau des originaux (~2 Mo) ;
# au-delà, la taille grimpe sans gain visible sur ces photographies.

# Les illustrations détourées (logos, rameau d'olivier) n'ont rien à voir avec
# la photographie : les étalonner écraserait leur transparence et leur trait.
SKIP = {"olive-sprig.webp"}

# --- Repères de l'étalonnage -------------------------------------------------
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
# Désaturation légère, pour la cohérence entre photos et la palette du site.
SATURATION = 0.84
# Réchauffement assumé : la pierre blonde et la lumière rasante des photos de
# référence tirent nettement vers l'ambre, le bleu est retenu d'autant.
WARMTH = np.array([1.030, 1.004, 0.963], dtype=np.float32)

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

    # 1. Même point noir et même point blanc pour toutes les photos : c'est ce
    #    calage qui fait qu'elles se ressemblent enfin.
    black = np.percentile(luma, BLACK_PCT)
    white = np.percentile(luma, WHITE_PCT)
    if white - black < 1e-4:
        return image
    lin = (lin - black) / (white - black)
    lin = lin * (TARGET_WHITE - TARGET_BLACK) + TARGET_BLACK
    lin = np.clip(lin, 0.0, None)

    # 2. Exposition alignée sur la luminance visée. Le gain est borné pour ne
    #    pas transformer une photo de nuit en plein jour.
    mean = float((lin @ LUMA).mean())
    if mean > 1e-4:
        lin *= np.clip(TARGET_MEAN / mean, 0.6, 1.7)

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

        graded.save(OUTPUT_DIR / path.name, "WEBP", quality=86, method=6)
        print(f"{path.name:24}{before:9.2f}{after:9.2f}{clipped:7.1f}%")


if __name__ == "__main__":
    main()
