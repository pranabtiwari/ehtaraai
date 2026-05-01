This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# EtharaAI

Full-stack Next.js app (App Router) with serverless API routes and a Mongoose/MongoDB backend.

This repository contains a small project management / tasks app built with Next.js, Mongoose, and JWT-based authentication. It includes API routes under `src/app/api`, React pages under `src/app`, and Mongoose models in `src/models`.

## Features

- User authentication (JWT access + refresh tokens)
- Projects: create/list projects
- Tasks: create/list/update tasks with status and due dates
- Dashboard with task summaries and overdue detection
- Simple, server-side API routes using Next.js App Router

## Tech stack

- Next.js (App Router)
- React (client components)
- Node + Next API routes
- Mongoose + MongoDB
- JSON Web Tokens for auth

## Getting started (local)

Prerequisites:

- Node.js (v18+ recommended)
- MongoDB (local or remote connection string)

1. Install dependencies

```bash
npm install
```

2. Create environment file

Create a `.env.local` file at the project root with the following variables (example):

3. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

Note: When changing Mongoose schemas or models during development, you may need to restart the dev server to clear the in-process model cache.

## Important files & folders

- `src/app` — Next.js App Router pages and API routes.
- `src/app/api` — Server API routes (auth, projects, tasks, users).
- `src/models` — Mongoose models: `Project`, `Task`, `User`.
- `src/lib/getUser.ts` — helper to extract/verify JWT tokens.

## API overview

Common endpoints (examples):

- `POST /api/auth/login` — login; returns/sets tokens
- `POST /api/auth/register` — register a new user
- `GET /api/projects` — list projects (requires auth)
- `POST /api/projects` — create project (requires auth)
- `GET /api/tasks` — list tasks
- `POST /api/tasks` — create task
- `PATCH /api/tasks/:id` — update task status/fields

All API routes typically return JSON. Client-side fetch calls use `credentials: 'include'` so cookies (refresh/access tokens when set as cookies) are sent; ensure cookie path/scoping is correct in your auth routes.

## Development notes

- Use `credentials: 'include'` on client fetches if your auth tokens are set as cookies.
- The app uses `populate()` for Mongoose refs (e.g., Project members). Ensure the `User` model is registered before calling `populate()` (restart server after model changes if you see MissingSchemaError).
- Client code includes a safe `readResponse` pattern to avoid JSON parse errors on empty/non-JSON responses.

## Testing

There are no automated tests included by default. To test manually:

- Start MongoDB and the Next dev server
- Register a user and login
- Create projects and tasks via the UI and API routes

## Deployment

Recommended: Vercel for Next.js apps or deploy as a Node server with environment variables set.

- Build for production:

```bash
npm run build
npm run start
```

Ensure `MONGODB_URI` and JWT secrets are set in your host environment.

## Contributing

Contributions are welcome. Please open issues for bugs or feature requests and submit pull requests with concise, focused changes.

## License

Add your license here (e.g., MIT). If none is chosen, the repository remains all-rights-reserved.

## Contact

Project maintainer: Pranab Tiwari (see repo owner)

---

If you'd like, I can also add a minimal `env.example` file and a short `CONTRIBUTING.md` next.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
