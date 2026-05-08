# Google OAuth Setup

This app uses **NextAuth.js** with the Google provider. Configure Google OAuth in Google Cloud Console, then set the client ID and secret in your environment.

## 1. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project.
3. Open **APIs & Services** → **Credentials**.
4. Click **Create Credentials** → **OAuth client ID**.
5. If prompted, configure the **OAuth consent screen** (External for real users, Internal for workspace-only).
6. Application type: **Web application**.
7. Name: e.g. `apisandbox` or `apisandbox-staging`.

## 2. Authorized JavaScript origins (and redirect URIs if using OAuth redirect)

This app uses **Google Identity Services (one-tap / button)** with ID token verification (like life-world-os), not the OAuth redirect flow. In Google Cloud Console → Credentials → your OAuth 2.0 Client ID:

- **Authorized JavaScript origins:** add your app origins, e.g.  
  `http://localhost:4000`,  
  `https://your-staging-domain.com`,  
  `https://your-production-domain.com`
- You do **not** need to add redirect URIs for the ID-token flow (only if you also use the legacy NextAuth Google redirect provider).

## 3. Environment variables

The app uses **Google Identity Services** (same as life-world-os): the frontend shows the official “Sign in with Google” button (with the G logo), gets an ID token, and the server verifies it. You need:

- **Server (verify token):** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **Client (show button):** `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (same value as `GOOGLE_CLIENT_ID`)

Set in `.env.local` (local), `.env` (Docker staging), or your host (Vercel, etc.):

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
```

- **Local:** Copy `config/environments/local.env.example` to `.env.local` and add the variables.
- **Staging (Docker):** Add the same variables to a `.env` file in the `apisandbox` directory. For the **Sign-in button** to work in the built app, set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (and optionally the others) **before** building the image, or ensure they are in `.env` when you run `docker-compose ... up -d --build`. See [GITFLOW.md](./GITFLOW.md).
- **Production:** Set in Vercel (or your host) project settings; do not commit secrets.

## 4. Where it’s used

- **Login:** “Sign in with Google” on `/login` uses `signIn("google", { callbackUrl })`.
- **Signup:** “Sign up with Google” on `/signup` uses the same flow; new users get an account on first sign-in.
- The Google provider is only registered when **both** `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set (see `lib/auth-config.ts`). If they are missing, the buttons still appear but the OAuth flow will not work until you add them.

## 5. Troubleshooting

- **Redirect URI mismatch:** The redirect URI in Google Cloud must match exactly (including scheme and port), e.g. `http://localhost:4000/api/auth/callback/google`.
- **Cookie/HTTPS:** In production, use HTTPS and ensure `NEXT_PUBLIC_APP_URL` matches the URL users see (for cookies and redirects).
- **Staging:** If staging is on a different host/port, add that exact origin’s callback URL in Google Cloud and set `NEXT_PUBLIC_APP_URL` (and optionally `GOOGLE_*`) in the staging environment.
