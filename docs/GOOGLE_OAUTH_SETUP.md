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

- **Authorized JavaScript origins:** add every host users open in the browser (scheme + host + port, no path), e.g.  
  `http://localhost:4000`  
  `https://apisandbox-coral.vercel.app` (production)  
  `https://apisandbox-devonte-amos-projects.vercel.app`  
  `https://apisandbox-git-main-devonte-amos-projects.vercel.app` (stable preview)  
  Each **unique PR preview URL** (`https://apisandbox-<hash>-….vercel.app`) must be listed too, or sign-in will hang / fail silently in the Google popup.
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

- **Login / signup:** Google Identity Services button → ID token → `POST /api/auth/google`.
- New users are created via the same bootstrap path as email signup (`createUserWithInitialData`).
- The Google provider is only registered when **both** `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set (see `lib/auth-config.ts`). The **GSI button + `/api/auth/google`** flow only requires **`GOOGLE_CLIENT_ID`** on the server. If it is missing, the disabled “Continue with Google” placeholder appears.

## 5. Troubleshooting

### Vercel preview / production

1. **Check config on the live host** (no secrets returned):

   ```bash
   curl -sS "https://<your-host>/api/health/auth" | jq
   curl -sS "https://<your-host>/api/health/db" | jq
   ```

   `authorizedJavaScriptOrigin` in the auth health response is the exact value to add in Google Cloud.

2. **Env on Vercel:** set `GOOGLE_CLIENT_ID` for **Production and Preview**. Optionally mirror with `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (same value).

3. **“Stuck on Signing in…”** after clicking Google:
   - Browser console: `origin_mismatch` / `idpiframe_initialization_failed` → add the origin from step 1.
   - Network tab: `POST /api/auth/google` → `bootstrap_failure` → fix database (see `/api/health/db`).
   - Network tab: no `/api/auth/google` request → GSI blocked or popup closed; check ad blockers and origins.

### Other

- **Redirect URI mismatch:** Only applies to the legacy NextAuth redirect flow (`/api/auth/callback/google`), not the GSI + ID token flow.
- **Cookie/HTTPS:** In production, use HTTPS and ensure `NEXT_PUBLIC_APP_URL` matches the URL users see (for cookies and redirects).
- **Staging:** Add that host’s origin in Google Cloud and set `GOOGLE_CLIENT_ID` in the staging environment.
