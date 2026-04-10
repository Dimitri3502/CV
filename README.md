# CV Monorepo (Turborepo)

Ce dépôt est maintenant un monorepo Turborepo avec :

- `apps/web` : frontend Next.js (CV + export PDF)
- `apps/api` : backend NestJS
- `packages/common` : package partagé importé par les deux apps

## Pré-requis

- Node.js 20+
- pnpm 10+

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

## Scripts utiles

```bash
pnpm build
pnpm lint
pnpm typecheck
```

## Endpoints

- Frontend CV : `http://localhost:3000`
- API health : `http://localhost:4000/api/v1/health`
