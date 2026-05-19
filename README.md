# Generative Media Web App

A full-featured AI-powered media generation platform where users can generate, edit, and manage AI-generated images with Firebase authentication, persistent storage, and a rich editing experience.

---

## Features

**Generation & Gallery**
- Prompt-based image generation using Hugging Face Inference API
- Persistent generation gallery with favorites
- Fast loading UI with animated spinners and progress feedback
- Tweak and regenerate workflow
- Async loading and error handling
- Modular and scalable architecture
- Firebase Google sign-in with per-user generations
- Private saved edits and account-scoped favorites


## Firebase Setup

This app uses Firebase Authentication with Google Sign-In only.

1. Create a Firebase project at https://firebase.google.com
2. In Firebase Console → Authentication:
   - Enable the **Google** provider
   - Add your app origin to authorized domains (e.g., `http://localhost:3000`)
3. Copy your web app config into `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=<your_key>
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your_auth_domain>
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your_project_id>
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your_bucket>
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your_sender_id>
   NEXT_PUBLIC_FIREBASE_APP_ID=<your_app_id>
   ```
4. Restart `npm run dev`

**Troubleshooting:**
- If you see `auth/configuration-not-found`, the Google provider is not enabled in Firebase Authentication console.

### Database Setup

1. Create a PostgreSQL database (Neon, Railway, or local)
2. Set `DATABASE_URL` in `.env.local`
3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Hugging Face Token

1. Get a token from https://huggingface.co/settings/tokens
2. Set `HF_TOKEN` in `.env.local`

---

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

---

## Tech Stack

- **Frontend:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS
- **Canvas Editing:** Konva.js, react-konva
- **Database:** PostgreSQL, Prisma ORM
- **Authentication:** Firebase Web SDK
- **AI Generation:** Hugging Face Inference API
- **Deployment:** Vercel (recommended)

---

## Architecture

- `app/` — Next.js App Router pages and API routes
- `app/api/` — Backend endpoints (generate, fetch, delete, claim-legacy)
- `components/` — React UI components and editors
- `lib/` — Firebase, Prisma, Hugging Face clients
- `services/` — API service wrappers (generation, auth)
- `utils/` — Utilities (export, download, cache, favorites)
- `prisma/` — Database schema and migrations
- `public/generated/` — Generated image assets

---

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run ESLint
- `node scripts/claim-legacy.js --uid <UID>` — Manually claim legacy DB rows to a user (admin tool)

---

## Future Improvements

AI upscaling
Public sharing
Cloud storage
Advanced image editing
AI background removal
Collections and folders
