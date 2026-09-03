export const ALLOWED_WORKSPACE_DEPENDENCIES = {
  "@pa/domain": [],
  "@pa/contracts": [],
  "@pa/application": ["@pa/domain", "@pa/contracts"],
  "@pa/config": [],
  "@pa/observability": [],
  "@pa/db": ["@pa/domain", "@pa/contracts", "@pa/application"],
  "@pa/ai": ["@pa/contracts", "@pa/application"],
  "@pa/audio": ["@pa/domain", "@pa/contracts", "@pa/application"],
  "@pa/storage": ["@pa/application", "@pa/contracts"],
  "@pa/queue": ["@pa/application", "@pa/contracts"],
  "@pa/ui": ["@pa/contracts"],
  "@pa/testkit": ["@pa/domain", "@pa/contracts", "@pa/application"],
  "@pa/web": ["@pa/ui", "@pa/application", "@pa/contracts", "@pa/config"],
  "@pa/worker": ["@pa/application", "@pa/contracts", "@pa/config"],
} as const;

export type WorkspaceGraph = Readonly<Record<string, readonly string[]>>;

export type DependencyViolation = {
  from: string;
  to: string;
  reason: string;
};

export function collectForbiddenWorkspaceDependencies(
  actual: WorkspaceGraph,
  allowed: WorkspaceGraph = ALLOWED_WORKSPACE_DEPENDENCIES,
): DependencyViolation[] {
  const violations: DependencyViolation[] = [];

  for (const [from, deps] of Object.entries(actual)) {
    const allowedDeps = allowed[from];
    if (allowedDeps === undefined) {
      violations.push({
        from,
        to: "*",
        reason: "package is not part of the documented workspace graph",
      });
      continue;
    }

    const allowedSet = new Set<string>(allowedDeps);
    for (const to of deps) {
      if (!allowedSet.has(to)) {
        violations.push({
          from,
          to,
          reason: "dependency is not allowed to point outward or sideways",
        });
      }
    }
  }

  return violations;
}

export function collectMissingRequiredDependencies(
  actual: WorkspaceGraph,
  allowed: WorkspaceGraph = ALLOWED_WORKSPACE_DEPENDENCIES,
): DependencyViolation[] {
  const missing: DependencyViolation[] = [];

  for (const [from, required] of Object.entries(allowed)) {
    const actualDeps = new Set(actual[from] ?? []);
    for (const to of required) {
      if (!actualDeps.has(to)) {
        missing.push({
          from,
          to,
          reason: "required inward dependency is missing",
        });
      }
    }
  }

  return missing;
}

export function collectMissingWorkspacePackages(
  actual: WorkspaceGraph,
  allowed: WorkspaceGraph = ALLOWED_WORKSPACE_DEPENDENCIES,
): string[] {
  return Object.keys(allowed).filter((name) => actual[name] === undefined);
}

export function extractWorkspaceDependencies(
  dependencies: Record<string, string> | undefined,
): string[] {
  return Object.entries(dependencies ?? {})
    .filter(([, version]) => version.startsWith("workspace:"))
    .map(([name]) => name)
    .sort((left, right) => left.localeCompare(right));
}
