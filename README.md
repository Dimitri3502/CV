# CV Monorepo (Turborepo)

Ce dépôt est maintenant un monorepo Turborepo avec :

- `apps/web` : frontend Next.js (CV + export PDF)
- `apps/api` : backend NestJS
- `apps/pdf-renderer` : service Python WeasyPrint dédié au rendu PDF
- `packages/common` : package partagé importé par les deux apps

## Pré-requis

- Node.js 20+
- pnpm 10+
- Docker (pour lancer le renderer PDF Python)

## Installation

```bash
pnpm install
```

## Lancer le projet

Lancer toutes les apps en dev :

```bash
pnpm dev
```

Lancer uniquement le frontend :

```bash
pnpm dev:web
```

Lancer uniquement l'API :

```bash
pnpm dev:api
```

Lancer le renderer PDF Python :

```bash
docker compose up pdf-renderer
```

## Scripts utiles

```bash
pnpm build
pnpm lint
pnpm typecheck
```

## Endpoints

- Frontend CV : `http://localhost:3000`
- API health : `http://localhost:4000/api/v1/health`
- API export PDF : `POST http://localhost:4000/api/v1/export-pdf`
- PDF renderer health : `http://localhost:8001/health`

## Export PDF

Le backend Node s'appuie sur le service `apps/pdf-renderer`, exposé par défaut via :

```bash
PDF_RENDERER_BASE_URL=http://localhost:8001
```

Le renderer se lance depuis la racine avec bind mount des fichiers Python :

```bash
docker compose up pdf-renderer
```

Quand le renderer tourne en conteneur et que `apps/web` reste lancé sur la machine hôte, les URLs `localhost` sont automatiquement réécrites vers `host.docker.internal` dans le renderer.

L'endpoint backend attend un JSON de cette forme :

```json
{
  "locale": "fr",
  "filenameBase": "dimitri-beubry-cv",
  "printPath": "/fr/dimitri-beubry/print"
}
```

La réponse est un buffer PDF (`Content-Type: application/pdf`).

Pour le frontend, vous pouvez configurer la base API avec :

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

Et pour l'API, la base du frontend utilisée par le renderer :

```bash
WEB_BASE_URL=http://localhost:3000
```
