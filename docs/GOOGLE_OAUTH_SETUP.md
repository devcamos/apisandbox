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

The app uses **Google Identity Services**: the frontend shows the official “Sign in with Google” button, gets an ID token, and the server verifies it.

| Variable | Required | Purpose |
|----------|----------|---------|
| `GOOGLE_CLIENT_ID` | **Yes** | Server verifies ID token; login/signup pages read this at **runtime** to render the GSI button |
| `GOOGLE_CLIENT_SECRET` | Optional | NextAuth Google provider only (legacy redirect flow) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Optional | Build-time alias; same value as `GOOGLE_CLIENT_ID` if you set it |

**Production (Vercel):** setting **`GOOGLE_CLIENT_ID` alone is enough** for the button to work — you do not need a separate public var unless you prefer one.

Set in `.env.local` (local), or Vercel → Settings → Environment Variables:

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
# Optional — same as GOOGLE_CLIENT_ID:
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
```

- **Local:** Copy `config/environments/local.env.example` to `.env.local` and add the variables.
- **Production:** See `config/environments/prod.env.example` for `AUTH_SECRET`, `DATABASE_URL`, and Google vars.

## 4. Where it’s used

- **Login:** “Sign in with Google” on `/login` uses `signIn("google", { callbackUrl })`.
- **Signup:** “Sign up with Google” on `/signup` uses the same flow; new users get an account on first sign-in.
- The Google provider is only registered when **both** `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set (see `lib/auth-config.ts`). The **GSI button + `/api/auth/google`** flow only requires **`GOOGLE_CLIENT_ID`** on the server. If it is missing, the disabled “Continue with Google” placeholder appears.

## 5. Troubleshooting

- **Redirect URI mismatch:** The redirect URI in Google Cloud must match exactly (including scheme and port), e.g. `http://localhost:4000/api/auth/callback/google`.
- **Cookie/HTTPS:** In production, use HTTPS and ensure `NEXT_PUBLIC_APP_URL` matches the URL users see (for cookies and redirects).
- **Staging:** If staging is on a different host/port, add that exact origin’s callback URL in Google Cloud and set `NEXT_PUBLIC_APP_URL` (and optionally `GOOGLE_*`) in the staging environment.
