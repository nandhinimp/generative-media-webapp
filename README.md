# Generative Media Web App

A minimal AI-powered media generation platform where users can generate, revisit, and tweak AI-generated images through a clean and scalable workflow.

---

## Features

- Prompt-based image generation
- Persistent generation gallery
- Tweak and regenerate workflow
- Async loading and error handling
- Modular and scalable architecture
- Firebase Google sign-in with per-user generations
- Private saved edits and account-scoped favorites


## Firebase Setup

This app uses Firebase Authentication with Google Sign-In only.

1. Create a Firebase project.
2. In Firebase Console, open Authentication and enable the Google provider.
3. Add your local app origin to the authorized domains.
4. Copy the web app config values into `.env` using these keys:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

5. Restart `npm run dev` after updating `.env`.

If Google sign-in shows `auth/configuration-not-found`, the provider is not enabled yet in Firebase Authentication.


## Future Improvements

- Canvas editing tools
- Video generation support
- Authentication
- Multiple AI providers
- Custom model workflows# generative-media-webapp
