# Test Users (Local Development)

Use this command to create default local test users only when the `User` table is empty:

```bash
npm run db:ensure-test-users
```

## Behavior

- If zero users exist: creates two test users.
- If one or more users already exist: does nothing.
- Refuses to run in `NODE_ENV=production`.

## Default Credentials

- `test@example.com` / `Test1234!@#$`
- `qa@example.com` / `QaTest1234!@#$`

## Typical Setup Flow

```bash
npm install
npm run db:migrate
npm run db:ensure-test-users
npm run dev
```
