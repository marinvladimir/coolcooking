# Cool Cooking

A recipe web app: browse recipes by category, cook along with a step-by-step
timer, save favorites, share your own recipes and estimate your daily
nutrition in the meal planner.

**Stack:** React 18 + TypeScript + Vite, styled-components, Framer Motion, React Router,
Netlify Functions, Supabase (Postgres) and Cloudinary for images.

## Project structure

```
src/
  api/          axios client for the Netlify functions
  components/   shared UI (header, recipe card/modal, cooking timer, …)
  constants/    recipe categories
  pages/        Home, Recipes, Favorites, Meal planner, Login, Register, 404
  states/       auth + theme context
  styles/       theme tokens, global styles and UI primitives
netlify/
  functions/    serverless API (recipes, login, register, favorites, upload)
  lib/          code shared by the functions (Supabase client, JWT helpers)
scripts/
  seedDb.js     creates the tables and inserts sample recipes
```

## Environment variables

Server side (Netlify site settings or a local `.env`):

| Variable       | Purpose                              |
| -------------- | ------------------------------------ |
| `SUPABASE_URL` | Supabase project URL                 |
| `SUPABASE_KEY` | Supabase service key                 |
| `JWT_SECRET`   | Secret used to sign the login tokens |

Client side (optional):

| Variable                        | Default     |
| ------------------------------- | ----------- |
| `VITE_API_BASE_URL`             | same origin |
| `VITE_CLOUDINARY_CLOUD_NAME`    | `drvntbfxu` |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | `cooking`   |

## Development

```bash
npm install
npx netlify dev   # frontend + functions on http://localhost:8888
```

`npm run dev` starts only the Vite frontend (no API).

Other scripts:

```bash
npm run build   # type-check and build to dist/
npm run lint    # ESLint
npm run format  # Prettier
npm run seed    # create tables and sample data in Supabase
```
