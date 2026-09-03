import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { extractWorkspaceDependencies, type WorkspaceGraph } from "./workspace-graph.js";

export function findRepoRoot(startDir: string): string {
  let current = startDir;

  while (true) {
    if (
      existsSync(join(current, "pnpm-workspace.yaml")) &&
      existsSync(join(current, "turbo.json"))
    ) {
      return current;
    }

    const parent = dirname(current);
    if (parent === current) {
      throw new Error(`Unable to locate repository root from ${startDir}`);
    }
    current = parent;
  }
}

export function readWorkspaceGraph(repoRoot: string): WorkspaceGraph {
  const graph: Record<string, string[]> = {};

  for (const kind of ["apps", "packages"] as const) {
    const kindDir = join(repoRoot, kind);
    if (!existsSync(kindDir)) {
      throw new Error(`Expected workspace directory ${kindDir}`);
    }

    for (const entry of readdirSync(kindDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }

      const packageJsonPath = join(kindDir, entry.name, "package.json");
      if (!existsSync(packageJsonPath)) {
        throw new Error(`Expected package.json at ${packageJsonPath}`);
      }

      const raw = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
        name?: unknown;
        dependencies?: unknown;
      };

      if (typeof raw.name !== "string" || raw.name.length === 0) {
        throw new Error(`Package at ${packageJsonPath} is missing a name`);
      }

      const dependencies =
        raw.dependencies && typeof raw.dependencies === "object" && !Array.isArray(raw.dependencies)
          ? (raw.dependencies as Record<string, string>)
          : undefined;

      graph[raw.name] = extractWorkspaceDependencies(dependencies);
    }
  }

  return graph;
}

export const FORBIDDEN_DOMAIN_SOURCE_PATTERNS = [
  /from ["']next(?:\/[^"']*)?["']/,
  /from ["']@pa\/(?:application|contracts|config|db|ai|audio|storage|queue|observability|ui|testkit|web|worker)["']/,
  /from ["']openai["']/,
  /process\.env/,
] as const;

export function findForbiddenSourceMatches(source: string, patterns: readonly RegExp[]): string[] {
  return patterns.filter((pattern) => pattern.test(source)).map((pattern) => pattern.source);
}
