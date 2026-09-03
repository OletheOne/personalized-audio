import { describe, expect, it } from "vitest";
import {
  ALLOWED_WORKSPACE_DEPENDENCIES,
  collectForbiddenWorkspaceDependencies,
  collectMissingRequiredDependencies,
  collectMissingWorkspacePackages,
  extractWorkspaceDependencies,
} from "./workspace-graph.js";

describe("extractWorkspaceDependencies", () => {
  it("keeps only workspace protocol dependencies", () => {
    expect(
      extractWorkspaceDependencies({
        "@pa/domain": "workspace:*",
        zod: "4.5.4",
      }),
    ).toEqual(["@pa/domain"]);
  });

  it("returns an empty list when dependencies are missing", () => {
    expect(extractWorkspaceDependencies(undefined)).toEqual([]);
  });
});

describe("collectForbiddenWorkspaceDependencies", () => {
  it("accepts the documented inward graph", () => {
    expect(collectForbiddenWorkspaceDependencies(ALLOWED_WORKSPACE_DEPENDENCIES)).toEqual([]);
  });

  it("rejects a domain dependency that points outward", () => {
    expect(
      collectForbiddenWorkspaceDependencies({
        ...ALLOWED_WORKSPACE_DEPENDENCIES,
        "@pa/domain": ["@pa/application"],
      }),
    ).toEqual([
      {
        from: "@pa/domain",
        to: "@pa/application",
        reason: "dependency is not allowed to point outward or sideways",
      },
    ]);
  });

  it("rejects an undeclared workspace package", () => {
    expect(
      collectForbiddenWorkspaceDependencies({
        ...ALLOWED_WORKSPACE_DEPENDENCIES,
        "@pa/mystery": ["@pa/domain"],
      }),
    ).toEqual([
      {
        from: "@pa/mystery",
        to: "*",
        reason: "package is not part of the documented workspace graph",
      },
    ]);
  });
});

describe("collectMissingRequiredDependencies", () => {
  it("reports a missing inward application dependency", () => {
    expect(
      collectMissingRequiredDependencies({
        ...ALLOWED_WORKSPACE_DEPENDENCIES,
        "@pa/application": ["@pa/domain"],
      }),
    ).toEqual([
      {
        from: "@pa/application",
        to: "@pa/contracts",
        reason: "required inward dependency is missing",
      },
    ]);
  });
});

describe("collectMissingWorkspacePackages", () => {
  it("reports architecture packages that disappeared from disk", () => {
    const withoutDomain = Object.fromEntries(
      Object.entries(ALLOWED_WORKSPACE_DEPENDENCIES).filter(([name]) => name !== "@pa/domain"),
    );
    expect(collectMissingWorkspacePackages(withoutDomain)).toEqual(["@pa/domain"]);
  });
});
