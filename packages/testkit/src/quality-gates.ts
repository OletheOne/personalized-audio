export const REQUIRED_INSTALL_COMMAND = "pnpm install --frozen-lockfile";

export const REQUIRED_QUALITY_GATE_COMMANDS = [
  "pnpm lint",
  "pnpm format:check",
  "pnpm typecheck",
  "pnpm test",
  "pnpm build",
] as const;

export const REQUIRED_GATE_STEP_NAMES = [
  "Lint",
  "Format check",
  "Typecheck",
  "Unit tests",
  "Production builds",
] as const;

const WRITE_PERMISSION =
  /\b(?:contents|id-token|packages|deployments|actions|attestations|checks|discussions|issues|pages|pull-requests|repository-projects|security-events|statuses):\s*write\b/;
const DEPLOY_COMMAND =
  /\b(?:npm publish|pnpm publish|docker push|wrangler deploy|vercel deploy|gh-pages|peaceiris\/actions-gh-pages|aws-actions\/|azure\/webapps-deploy)\b/i;

function hasRunCommand(source: string, command: string): boolean {
  const pattern = new RegExp(`^\\s+run:\\s+${escapeRegExp(command)}\\s*$`, "m");
  return pattern.test(source);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function collectWorkflowProblems(source: string): string[] {
  const normalized = source.replace(/\r\n/g, "\n");
  const problems: string[] = [];

  if (!/^\s*on:\s*$/m.test(normalized) || !normalized.includes("pull_request:")) {
    problems.push("workflow must run on pull requests");
  }

  if (!normalized.includes("contents: read")) {
    problems.push("workflow must set least-privilege permissions.contents: read");
  }

  if (WRITE_PERMISSION.test(normalized)) {
    problems.push("workflow must not grant write permissions");
  }

  if (!normalized.includes("cancel-in-progress:")) {
    problems.push("workflow must declare pull-request concurrency cancellation");
  }

  if (
    !normalized.includes("github.event_name == 'pull_request'") &&
    !normalized.includes('github.event_name == "pull_request"')
  ) {
    problems.push("concurrency cancellation must be limited to pull requests");
  }

  if (!normalized.includes("cache: pnpm")) {
    problems.push("dependency cache must use the pnpm store");
  }

  if (!normalized.includes("pnpm-lock.yaml")) {
    problems.push("dependency cache must be keyed on pnpm-lock.yaml");
  }

  if (/path:\s*(?:node_modules|\.turbo)\b/.test(normalized)) {
    problems.push("workflow must not cache node_modules or .turbo");
  }

  if (!hasRunCommand(normalized, REQUIRED_INSTALL_COMMAND)) {
    problems.push(`missing dedicated step for ${REQUIRED_INSTALL_COMMAND}`);
  }

  for (const command of REQUIRED_QUALITY_GATE_COMMANDS) {
    if (!hasRunCommand(normalized, command)) {
      problems.push(`missing dedicated step for ${command}`);
    }
  }

  for (const name of REQUIRED_GATE_STEP_NAMES) {
    if (!normalized.includes(`name: ${name}`)) {
      problems.push(`missing readable step name: ${name}`);
    }
  }

  if (DEPLOY_COMMAND.test(normalized)) {
    problems.push("workflow must not deploy");
  }

  return problems;
}

export function collectLocalScriptProblems(source: string): string[] {
  const problems: string[] = [];

  for (const command of REQUIRED_QUALITY_GATE_COMMANDS) {
    const args = command.replace(/^pnpm\s+/, "");
    if (!source.includes(`"${args}"`) && !source.includes(`["${args}"]`)) {
      if (!source.includes(args)) {
        problems.push(`local CI script must invoke ${command}`);
      }
    }
  }

  return problems;
}

export function collectProveScriptProblems(source: string): string[] {
  const problems: string[] = [];

  if (!source.includes("debugger")) {
    problems.push("prove script must include a lint-failure fixture");
  }

  if (!source.includes("ciProofFormat")) {
    problems.push("prove script must include a format-failure fixture");
  }

  if (!source.includes("ciProofTypecheck")) {
    problems.push("prove script must include a typecheck-failure fixture");
  }

  if (!source.includes("fails on purpose")) {
    problems.push("prove script must include a unit-test-failure fixture");
  }

  if (!source.includes("pa-002-does-not-exist") || !source.includes("@ts-nocheck")) {
    problems.push("prove script must include a production-build-failure fixture");
  }

  if (!source.includes("pa-002-never-install")) {
    problems.push("prove script must include a frozen-lockfile-failure fixture");
  }

  if (!source.includes("removeProofFiles") && !source.includes("force: true")) {
    problems.push("prove script must remove proof fixtures after each gate");
  }

  if (!source.includes("apps/web/.next") || !source.includes("next-env.d.ts")) {
    problems.push("prove script must remove Next.js generated types after the build fixture");
  }

  return problems;
}
