# emoki

A modern full-stack TypeScript application built with Next.js and Hono.

## Tech Stack

- **Frontend**: Next.js, TailwindCSS, shadcn/ui
- **Backend**: Hono, tRPC
- **Database**: PostgreSQL with Drizzle ORM
- **Runtime**: Bun
- **Authentication**: Better Auth

## Quick Start

1. Install dependencies:

```bash
bun install
```

2. Set up your PostgreSQL database and update `apps/server/.env`

3. Push database schema:

```bash
bun db:push
```

4. Start development server:

```bash
bun dev
```

Visit [http://localhost:3001](http://localhost:3001) for the web app and [http://localhost:3000](http://localhost:3000) for the API.

## Scripts

- `bun dev` - Start all apps
- `bun build` - Build all apps
- `bun db:push` - Update database schema
- `bun db:studio` - Open database UI
