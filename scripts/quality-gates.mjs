export const FROZEN_INSTALL_ARGS = ["install", "--frozen-lockfile"];

/** Gates that run after a frozen install. Order matches GitHub Actions. */
export const QUALITY_GATES = [
  { id: "lint", label: "lint", args: ["lint"] },
  { id: "format", label: "format check", args: ["format:check"] },
  { id: "typecheck", label: "typecheck", args: ["typecheck"] },
  { id: "test", label: "unit tests", args: ["test"] },
  { id: "build", label: "production builds", args: ["build"] },
];

export function pnpmCommand(bin, args) {
  return `${bin} ${args.join(" ")}`;
}
