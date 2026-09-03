export const TESTKIT_PACKAGE = {
  name: "@pa/testkit",
  layer: "testkit",
} as const;

export {
  ALLOWED_WORKSPACE_DEPENDENCIES,
  collectForbiddenWorkspaceDependencies,
  collectMissingRequiredDependencies,
  collectMissingWorkspacePackages,
  extractWorkspaceDependencies,
} from "./workspace-graph.js";
export type { DependencyViolation, WorkspaceGraph } from "./workspace-graph.js";
export {
  findForbiddenSourceMatches,
  findRepoRoot,
  FORBIDDEN_DOMAIN_SOURCE_PATTERNS,
  readWorkspaceGraph,
} from "./workspace-files.js";
