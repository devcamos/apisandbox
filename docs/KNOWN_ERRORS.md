# Known errors

## Vercel preview fails before build: Neon branch limit

### Symptoms

- The Vercel PR check fails immediately.
- The deployment reports `BUILD_FAILED: Resource provisioning failed`.
- Build duration is `0ms` and no application build logs exist.
- The deployment record reports `integrations.status: error`.
- Neon shows `Branch limit reached` (the Free plan currently allows 10 branches).

This is a Neon/Vercel provisioning failure, not a Next.js build failure. The Vercel integration tries to create `preview/<git-branch>` before running the application build. When Neon has no branch capacity, the deployment stops at that integration action.

### Cleanup policy

Keep the project at **no more than five total Neon branches**. This reserves capacity for new PR previews.

The cleanup command:

- always preserves `main` and every non-preview branch;
- checks each `preview/<name>` against the corresponding GitHub branch;
- only selects previews whose GitHub branch no longer exists;
- deletes oldest eligible branches first until the total is at most five;
- performs a dry run unless `--apply` is explicitly supplied.

### Run the cleanup

Create a Neon API key in the Neon Console and keep it out of the repository.

```bash
export NEON_API_KEY='<your Neon API key>'
export NEON_PROJECT_ID='shy-butterfly-04063890'

# Preview the deletion plan (no changes).
npm run neon:branches:cleanup

# Apply the reviewed plan, retaining no more than five total branches.
npm run neon:branches:cleanup -- --apply
```

`GITHUB_TOKEN` is optional for this public repository and avoids anonymous GitHub API rate limits. Override the defaults with `--max <count>`, `--repo <owner/name>`, or `--project-id <id>`.

After cleanup, redeploy the failed Vercel preview and verify the PR checks:

```bash
gh pr checks --watch
```

Do not delete branches directly unless their source Git branch or PR is confirmed closed or merged. Neon branch deletion removes that preview branch's isolated data.
