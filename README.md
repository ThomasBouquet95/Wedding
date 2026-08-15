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
- Deux cibles de déploiement au choix :
  - **GitHub Pages** — build statique prérendu, publié par GitHub Actions
    (`.github/workflows/deploy-github-pages.yml`)
  - **Vercel** — SSR via Nitro (Build Output API v3)

## Développement

```sh
npm install
npm run dev
```

Autres commandes : `npm run build`, `npm run lint`, `npm run format`.

## Mise en ligne

- GitHub Pages : `DEPLOIEMENT-GITHUB-PAGES.md`
- Vercel : `DEPLOIEMENT-VERCEL.md`

Le domaine public est renseigné au build par la variable `VITE_SITE_URL` — le
workflow GitHub Pages la calcule seul. Il sert aux balises canoniques et Open
Graph, qui exigent des URL absolues ; sans elle, la valeur par défaut de
`src/lib/site.ts` s'applique.

## Charte

- Palette et typographie : tokens CSS dans `src/styles.css`. Ne jamais coder une
  couleur Tailwind en dur — utiliser `sage`, `olive`, `ink`, etc.
- Typographies : Cormorant Garamond (titres), Jost (labels capitales), Karla (texte).
- Photographies : un filtre CSS global uniformise toutes les images (clair, peu
  saturé). Les illustrations et logos s'en excluent via `data-tone="raw"`.
- Images : photographies réelles du lieu uniquement, en plein jour, sans personnes.
  Format WebP, dimensionnées pour leur usage réel.
- Dates : toujours « 25 — 26 juin 2027 », le 27 étant mentionné comme journée libre.
