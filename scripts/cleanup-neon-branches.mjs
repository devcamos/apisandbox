import process from "node:process";

const NEON_API_BASE = "https://console.neon.tech/api/v2";
const GITHUB_API_BASE = "https://api.github.com";

function usage() {
  console.log(`Usage:
  npm run neon:branches:cleanup -- --project-id <id> [options]

Options:
  --project-id <id>  Neon project ID (or set NEON_PROJECT_ID)
  --repo <owner/name> GitHub repository (or set GITHUB_REPOSITORY)
  --max <count>      Maximum total Neon branches to retain (default: 5)
  --apply            Delete eligible branches; otherwise perform a dry run
  --help             Show this help

Required environment:
  NEON_API_KEY       Neon API key with access to the project

Optional environment:
  GITHUB_TOKEN       Raises GitHub API limits for the source-branch checks
`);
}

function parseArguments(argv) {
  const options = {
    apply: false,
    maxBranches: 5,
    projectId: process.env.NEON_PROJECT_ID || "",
    repository: process.env.GITHUB_REPOSITORY || "devcamos/apisandbox",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--apply") {
      options.apply = true;
    } else if (argument === "--help" || argument === "-h") {
      options.help = true;
    } else if (argument === "--project-id") {
      options.projectId = argv[++index] || "";
    } else if (argument === "--repo") {
      options.repository = argv[++index] || "";
    } else if (argument === "--max") {
      options.maxBranches = Number.parseInt(argv[++index] || "", 10);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  if (options.help) return options;
  if (!options.projectId) throw new Error("Provide --project-id or set NEON_PROJECT_ID.");
  if (!/^[-\w]+\/[-\w.]+$/.test(options.repository)) {
    throw new Error("--repo must use the owner/name format.");
  }
  if (!Number.isInteger(options.maxBranches) || options.maxBranches < 1) {
    throw new Error("--max must be an integer greater than zero.");
  }
  if (!process.env.NEON_API_KEY) throw new Error("NEON_API_KEY is required.");

  return options;
}

async function request(url, { headers = {}, method = "GET" } = {}) {
  const response = await fetch(url, { headers, method });
  if (response.ok) return response;

  const body = await response.text();
  const detail = body ? `: ${body.slice(0, 300)}` : "";
  throw new Error(`${method} ${url} failed with ${response.status}${detail}`);
}

function neonHeaders() {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.NEON_API_KEY}`,
  };
}

async function listNeonBranches(projectId) {
  const url = new URL(`${NEON_API_BASE}/projects/${encodeURIComponent(projectId)}/branches`);
  url.searchParams.set("limit", "10000");
  url.searchParams.set("sort_by", "created_at");
  url.searchParams.set("sort_order", "asc");
  const response = await request(url, { headers: neonHeaders() });
  const payload = await response.json();
  return payload.branches || [];
}

async function githubBranchExists(repository, branchName) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "apisandbox-neon-branch-cleanup",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const url = `${GITHUB_API_BASE}/repos/${repository}/branches/${encodeURIComponent(branchName)}`;
  const response = await fetch(url, { headers });
  if (response.status === 200) return true;
  if (response.status === 404) return false;

  const body = await response.text();
  throw new Error(`GitHub branch check failed with ${response.status}: ${body.slice(0, 300)}`);
}

async function deleteNeonBranch(projectId, branchId) {
  const url = `${NEON_API_BASE}/projects/${encodeURIComponent(projectId)}/branches/${encodeURIComponent(branchId)}`;
  await request(url, { headers: neonHeaders(), method: "DELETE" });
}

function branchAge(branch) {
  const timestamp = branch.created_at || branch.updated_at;
  return timestamp ? new Date(timestamp).toISOString() : "unknown";
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    usage();
    return;
  }

  const branches = await listNeonBranches(options.projectId);
  const deleteCount = Math.max(0, branches.length - options.maxBranches);

  console.log(`Neon branches: ${branches.length}; configured maximum: ${options.maxBranches}.`);
  if (deleteCount === 0) {
    console.log("No cleanup is required.");
    return;
  }

  const previewBranches = branches.filter(
    (branch) => branch.name?.startsWith("preview/") && branch.parent_id,
  );
  const candidates = [];

  for (const branch of previewBranches) {
    const sourceBranch = branch.name.slice("preview/".length);
    if (!(await githubBranchExists(options.repository, sourceBranch))) {
      candidates.push(branch);
    }
  }

  const selected = candidates.slice(0, deleteCount);
  if (selected.length === 0) {
    throw new Error("No obsolete preview branches are eligible for cleanup.");
  }

  console.log(`${options.apply ? "Deleting" : "Would delete"} ${selected.length} obsolete preview branch(es):`);
  for (const branch of selected) {
    console.log(`- ${branch.name} (${branch.id}, created ${branchAge(branch)})`);
  }

  if (!options.apply) {
    console.log("Dry run only. Re-run with --apply to delete these branches.");
    return;
  }

  for (const branch of selected) {
    await deleteNeonBranch(options.projectId, branch.id);
    console.log(`Deleted ${branch.name}.`);
  }

  const remaining = await listNeonBranches(options.projectId);
  console.log(`Cleanup complete. Neon now has ${remaining.length} branch(es).`);
  if (remaining.length > options.maxBranches) {
    console.warn(
      `The project remains above ${options.maxBranches} because active or non-preview branches were preserved.`,
    );
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
