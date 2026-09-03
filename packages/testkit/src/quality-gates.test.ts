import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { findRepoRoot } from "./workspace-files.js";
import {
  collectLocalScriptProblems,
  collectProveScriptProblems,
  collectWorkflowProblems,
  REQUIRED_INSTALL_COMMAND,
  REQUIRED_QUALITY_GATE_COMMANDS,
} from "./quality-gates.js";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = findRepoRoot(here);

function readRepoFile(relativePath: string): string {
  return readFileSync(join(repoRoot, relativePath), "utf8");
}

function runPnpm(args: string[], options: { input?: string; cwd?: string } = {}) {
  const result = spawnSync("pnpm", args, {
    cwd: options.cwd ?? repoRoot,
    encoding: "utf8",
    env: process.env,
    input: options.input,
    shell: true,
  });

  if (result.error) {
    throw result.error;
  }

  return result;
}

describe("CI workflow contract", () => {
  it("invokes frozen install and each named quality gate as a dedicated step", () => {
    const source = readRepoFile(".github/workflows/ci.yml");
    expect(collectWorkflowProblems(source)).toEqual([]);
  });

  it("reports a missing lint step and write permissions", () => {
    const problems = collectWorkflowProblems(`
name: CI
on:
  push:
permissions:
  contents: write
jobs:
  quality:
    steps:
      - run: pnpm test
`);

    expect(problems).toEqual(
      expect.arrayContaining([
        "workflow must run on pull requests",
        "workflow must not grant write permissions",
        "workflow must declare pull-request concurrency cancellation",
        "concurrency cancellation must be limited to pull requests",
        "dependency cache must use the pnpm store",
        "dependency cache must be keyed on pnpm-lock.yaml",
        `missing dedicated step for ${REQUIRED_INSTALL_COMMAND}`,
        "missing dedicated step for pnpm lint",
      ]),
    );
  });

  it("reports a deployment step", () => {
    const source = readRepoFile(".github/workflows/ci.yml");
    const withDeploy = `${source}\n      - run: npm publish\n`;
    expect(collectWorkflowProblems(withDeploy)).toContain("workflow must not deploy");
  });
});

describe("local quality-gate scripts", () => {
  it("mirrors the GitHub Actions gate commands", () => {
    const source = readRepoFile("scripts/run-quality-gates.mjs");
    const gates = readRepoFile("scripts/quality-gates.mjs");
    const packageJson = JSON.parse(readRepoFile("package.json")) as {
      scripts?: Record<string, string>;
    };

    expect(collectLocalScriptProblems(`${gates}\n${source}`)).toEqual([]);
    expect(packageJson.scripts?.quality).toBe("node scripts/run-quality-gates.mjs");
    expect(packageJson.scripts?.["prove:gates"]).toBe("node scripts/prove-quality-gates.mjs");

    for (const command of REQUIRED_QUALITY_GATE_COMMANDS) {
      const scriptName = command.replace(/^pnpm\s+/, "");
      expect(gates).toContain(scriptName);
    }
  });

  it("reports a local script that omits a gate", () => {
    expect(collectLocalScriptProblems("console.log('noop');\n")).toEqual(
      expect.arrayContaining([
        "local CI script must invoke pnpm lint",
        "local CI script must invoke pnpm format:check",
        "local CI script must invoke pnpm typecheck",
        "local CI script must invoke pnpm test",
        "local CI script must invoke pnpm build",
      ]),
    );
  });

  it("covers every class of failing fixture and removes it", () => {
    const source = readRepoFile("scripts/prove-quality-gates.mjs");
    expect(collectProveScriptProblems(source)).toEqual([]);
  });

  it("reports a prove script that omits a gate class", () => {
    expect(collectProveScriptProblems("console.log('noop');\n")).toEqual(
      expect.arrayContaining([
        "prove script must include a lint-failure fixture",
        "prove script must include a format-failure fixture",
        "prove script must include a typecheck-failure fixture",
        "prove script must include a unit-test-failure fixture",
        "prove script must include a production-build-failure fixture",
        "prove script must include a frozen-lockfile-failure fixture",
        "prove script must remove Next.js generated types after the build fixture",
      ]),
    );
  });
});

describe("tool failure paths", () => {
  it("fails lint on a debugger fixture", () => {
    const result = runPnpm(["exec", "eslint", "--stdin", "--stdin-filename", "proof.ts"], {
      input: "debugger;\n",
    });
    expect(result.status).not.toBe(0);
    expect(`${result.stdout}\n${result.stderr}`).toMatch(/Unexpected 'debugger'/);
  });

  it("fails format check on an unformatted fixture", () => {
    const result = runPnpm(["exec", "prettier", "--check", "--stdin-filepath", "proof.ts"], {
      input: "export const ciProofFormat={a:1,b:2}\n",
    });
    expect(result.status).not.toBe(0);
    expect(`${result.stdout}\n${result.stderr}`).toMatch(/\(stdin\)|Code style issues|prettier/i);
  });

  it("fails typecheck on a type-error fixture", () => {
    const directory = mkdtempSync(join(tmpdir(), "pa-002-typecheck-"));
    const tsconfig = join(directory, "tsconfig.json");
    const file = join(directory, "proof.ts");
    writeFileSync(
      tsconfig,
      JSON.stringify({
        compilerOptions: { strict: true, noEmit: true, skipLibCheck: true },
        files: ["proof.ts"],
      }),
    );
    writeFileSync(file, 'export const ciProofTypecheck: number = "not-a-number";\n');

    const result = runPnpm(["exec", "tsc", "--pretty", "false", "-p", tsconfig]);
    expect(result.status).not.toBe(0);
    expect(`${result.stdout}\n${result.stderr}`).toMatch(/not-a-number|is not assignable/);
  });
});
