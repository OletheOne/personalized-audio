import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pnpmCommand, QUALITY_GATES } from "./quality-gates.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function runGate(gate) {
  console.log(`\n→ ${gate.label}`);
  const result = spawnSync("pnpm", gate.args, {
    cwd: repoRoot,
    stdio: "inherit",
    env: process.env,
    shell: true,
  });

  if (result.error) {
    console.error(`\nQuality gate failed: ${gate.label}`);
    console.error(result.error.message);
    console.error(`Re-run: ${pnpmCommand("pnpm", gate.args)}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`\nQuality gate failed: ${gate.label}`);
    console.error(`Re-run: ${pnpmCommand("pnpm", gate.args)}`);
    process.exit(result.status ?? 1);
  }
}

for (const gate of QUALITY_GATES) {
  runGate(gate);
}

console.log("\nAll quality gates passed.");
