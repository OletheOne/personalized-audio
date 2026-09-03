import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { APPLICATION_PACKAGE } from "@pa/application";
import { CONTRACTS_PACKAGE } from "@pa/contracts";
import { DOMAIN_PACKAGE } from "@pa/domain";
import { describe, expect, it } from "vitest";
import {
  collectForbiddenWorkspaceDependencies,
  collectMissingRequiredDependencies,
  collectMissingWorkspacePackages,
} from "./workspace-graph.js";
import {
  findForbiddenSourceMatches,
  findRepoRoot,
  FORBIDDEN_DOMAIN_SOURCE_PATTERNS,
  readWorkspaceGraph,
} from "./workspace-files.js";

const here = dirname(fileURLToPath(import.meta.url));

describe("repository workspace graph", () => {
  it("keeps package dependencies flowing inward", () => {
    const repoRoot = findRepoRoot(here);
    const graph = readWorkspaceGraph(repoRoot);

    expect(collectMissingWorkspacePackages(graph)).toEqual([]);
    expect(collectForbiddenWorkspaceDependencies(graph)).toEqual([]);
    expect(collectMissingRequiredDependencies(graph)).toEqual([]);
  });

  it("proves application source imports domain and contracts", () => {
    expect(APPLICATION_PACKAGE.dependsOn).toEqual([DOMAIN_PACKAGE.name, CONTRACTS_PACKAGE.name]);
  });
});

describe("findRepoRoot", () => {
  it("fails when no workspace markers exist", () => {
    expect(() => findRepoRoot(join(tmpdir(), "pa-001-missing-root"))).toThrow(
      /Unable to locate repository root/,
    );
  });
});

describe("domain source guards", () => {
  it("keeps domain free of outer-layer imports", () => {
    const repoRoot = findRepoRoot(here);
    const domainSource = readFileSync(join(repoRoot, "packages/domain/src/index.ts"), "utf8");

    expect(findForbiddenSourceMatches(domainSource, FORBIDDEN_DOMAIN_SOURCE_PATTERNS)).toEqual([]);
  });

  it("detects forbidden domain imports in fixture source", () => {
    expect(
      findForbiddenSourceMatches(
        `import { APPLICATION_PACKAGE } from "@pa/application";\nconsole.log(process.env.SECRET);\n`,
        FORBIDDEN_DOMAIN_SOURCE_PATTERNS,
      ).length,
    ).toBeGreaterThan(0);
  });
});
