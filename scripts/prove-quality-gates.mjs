import { spawnSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FROZEN_INSTALL_ARGS, pnpmCommand, QUALITY_GATES } from "./quality-gates.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const nextEnvPath = join(repoRoot, "apps/web/next-env.d.ts");

const FIXTURES = {
  lint: {
    path: join(repoRoot, "packages/domain/src/__pa002_ci_proof_lint.ts"),
    contents: "debugger;\n",
  },
  format: {
    path: join(repoRoot, "packages/domain/src/__pa002_ci_proof_format.ts"),
    contents: "export const ciProofFormat={a:1,b:2}\n",
  },
  typecheck: {
    path: join(repoRoot, "packages/domain/src/__pa002_ci_proof_typecheck.ts"),
    contents: 'export const ciProofTypecheck: number = "not-a-number";\n',
  },
  test: {
    path: join(repoRoot, "packages/domain/src/__pa002_ci_proof.test.ts"),
    contents: `import { describe, expect, it } from "vitest";

describe("PA-002 proof", () => {
  it("fails on purpose", () => {
    expect(false).toBe(true);
  });
});
`,
  },
  build: {
    path: join(repoRoot, "apps/web/src/app/pa002-ci-proof-build/page.tsx"),
    contents: `// @ts-nocheck — typecheck must still pass; Next.js production compile must not.
import { missingBuildProof } from "./pa-002-does-not-exist";

export default function CiProofBuildPage() {
  return missingBuildProof;
}
`,
  },
};

const ALL_FIXTURE_PATHS = [
  FIXTURES.lint.path,
  FIXTURES.format.path,
  FIXTURES.typecheck.path,
  FIXTURES.test.path,
  FIXTURES.build.path,
];

/** @type {string | undefined} */
let originalNextEnv;

function runPnpm(args) {
  return spawnSync("pnpm", args, {
    cwd: repoRoot,
    encoding: "utf8",
    env: process.env,
    shell: true,
  });
}

function summarize(result) {
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
  const lines = output.split(/\r?\n/).filter(Boolean);
  return lines.slice(-12).join("\n");
}

async function removeProofFiles() {
  await Promise.all(ALL_FIXTURE_PATHS.map((path) => rm(path, { force: true })));
  await rm(dirname(FIXTURES.build.path), { recursive: true, force: true });
  await rm(join(repoRoot, "apps/web/.next"), { recursive: true, force: true });
  if (originalNextEnv !== undefined) {
    await writeFile(nextEnvPath, originalNextEnv, "utf8");
  }
}

async function withFixture(fixture, run) {
  await mkdir(dirname(fixture.path), { recursive: true });
  await writeFile(fixture.path, fixture.contents, "utf8");
  try {
    return run();
  } finally {
    await rm(fixture.path, { force: true });
    if (fixture.path === FIXTURES.build.path) {
      await rm(dirname(fixture.path), { recursive: true, force: true });
    }
  }
}

function expectFailure(gateLabel, args, result) {
  if (result.error) {
    throw new Error(`${gateLabel} did not run: ${result.error.message}`);
  }

  if (result.status === 0) {
    throw new Error(
      `${gateLabel} passed with a deliberately failing fixture. Command: ${pnpmCommand("pnpm", args)}`,
    );
  }

  console.log(`  blocked (${pnpmCommand("pnpm", args)}, exit ${result.status})`);
  const tail = summarize(result);
  if (tail.length > 0) {
    console.log(
      tail
        .split("\n")
        .map((line) => `    ${line}`)
        .join("\n"),
    );
  }
}

async function proveFrozenInstall() {
  const packageJsonPath = join(repoRoot, "package.json");
  const lockfilePath = join(repoRoot, "pnpm-lock.yaml");
  const originalPackageJson = await readFile(packageJsonPath, "utf8");
  const originalLockfile = await readFile(lockfilePath, "utf8");

  try {
    const pkg = JSON.parse(originalPackageJson);
    pkg.dependencies = {
      ...(pkg.dependencies && typeof pkg.dependencies === "object" ? pkg.dependencies : {}),
      "pa-002-never-install": "0.0.0",
    };
    await writeFile(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
    const result = runPnpm(FROZEN_INSTALL_ARGS);
    expectFailure("frozen install", FROZEN_INSTALL_ARGS, result);
  } finally {
    await writeFile(packageJsonPath, originalPackageJson, "utf8");
    await writeFile(lockfilePath, originalLockfile, "utf8");
  }
}

originalNextEnv = await readFile(nextEnvPath, "utf8");
await removeProofFiles();

const results = [];

try {
  console.log("Proving each quality gate blocks on a failing fixture, then removing it.\n");

  console.log("→ frozen install");
  await proveFrozenInstall();
  results.push("frozen install");

  for (const gate of QUALITY_GATES) {
    const fixture = FIXTURES[gate.id];
    if (!fixture) {
      throw new Error(`No proof fixture defined for gate ${gate.id}`);
    }

    console.log(`→ ${gate.label}`);
    await withFixture(fixture, () => {
      expectFailure(gate.label, gate.args, runPnpm(gate.args));
    });
    results.push(gate.label);
  }

  console.log("\nEvery named gate blocked, and proof fixtures were removed:");
  for (const label of results) {
    console.log(`  - ${label}`);
  }
} finally {
  await removeProofFiles();
}
