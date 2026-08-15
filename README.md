# Mariage Alexandra & Thomas

Site vitrine du mariage d'Alexandra & Thomas, les **25 et 26 juin 2027** au
Couvent Notre-Dame des Prés, à Reillanne (Provence), avec une journée libre le
dimanche 27.

Site purement informatif : aucun formulaire, aucune authentification. Les
réponses des invités (RSVP) se font hors site, via le QR code de l'invitation.

## Stack

- TanStack Start v1 (React 19, Vite) + TypeScript
- Tailwind CSS v4, tokens sémantiques définis dans `src/styles.css`
- Routage par fichiers dans `src/routes/`
- Déploiement Vercel, SSR via Nitro (Build Output API v3)
- Photographies étalonnées en amont par `scripts/grade-photos.py`

## Développement

```sh
npm install
npm run dev
```

Autres commandes : `npm run build`, `npm run lint`, `npm run format`.

## Mise en ligne

Voir `DEPLOIEMENT-VERCEL.md`.

Le domaine public est renseigné au build par la variable `VITE_SITE_URL`. Il
sert aux balises canoniques et Open Graph, qui exigent des URL absolues ; sans
elle, la valeur par défaut de `src/lib/site.ts` s'applique.

## Charte

- Palette et typographie : tokens CSS dans `src/styles.css`. Ne jamais coder une
  couleur Tailwind en dur — utiliser `sage`, `olive`, `ink`, etc.
- Typographies : Cormorant Garamond (titres), Jost (labels capitales), Karla (texte).
- Photographies : l'harmonisation se fait en amont, image par image, via
  `python3 scripts/grade-photos.py` — même point noir, même point blanc, ombres
  mates, hautes lumières préservées. Les originaux vivent dans
  `src/assets/source/` et ne sont jamais modifiés ; le script réécrit
  `src/assets/`. Aucun filtre CSS ne retouche les images.
- Ajouter une photo : la déposer dans `src/assets/source/`, relancer le script.
- Images : photographies réelles du lieu uniquement, en plein jour, sans personnes.
  Format WebP, dimensionnées pour leur usage réel.
- Dates : toujours « 25 — 26 juin 2027 », le 27 étant mentionné comme journée libre.
