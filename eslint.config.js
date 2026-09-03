import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

const relativeWorkspaceImports = {
  group: [
    "**/packages/**",
    "../domain",
    "../domain/**",
    "../contracts",
    "../contracts/**",
    "../application",
    "../application/**",
    "../config",
    "../config/**",
    "../ui",
    "../ui/**",
  ],
  message: "Import workspace packages by their @pa/* name, not relative paths.",
};

const frameworkPaths = [
  "next",
  "react",
  "react-dom",
  "prisma",
  "openai",
  "bullmq",
  "ioredis",
  "ffmpeg-static",
  "fluent-ffmpeg",
];

const frameworkPatterns = [
  "next/*",
  "react/*",
  "react-dom/*",
  "@prisma/*",
  "openai/*",
  "@aws-sdk/*",
];

/**
 * @param {string[]} items
 * @returns {string[]}
 */
function unique(items) {
  return [...new Set(items)];
}

/**
 * @param {object} options
 * @param {string[]} [options.paths]
 * @param {string[]} [options.patterns]
 * @param {string[]} [options.allowedFrameworks]
 * @param {string} options.message
 */
function restricted({ paths = [], patterns = [], allowedFrameworks = [], message }) {
  const allowed = new Set(allowedFrameworks);
  const allPaths = unique([...frameworkPaths, ...paths]).filter((name) => !allowed.has(name));
  const allPatterns = unique([...frameworkPatterns, ...patterns]).filter((pattern) => {
    const root = pattern.replace(/\/\*$/, "");
    return !allowed.has(root);
  });

  return {
    "no-restricted-imports": [
      "error",
      {
        paths: allPaths.map((name) => ({ name, message })),
        patterns: [
          relativeWorkspaceImports,
          ...(allPatterns.length > 0 ? [{ group: allPatterns, message }] : []),
        ],
      },
    ],
  };
}

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/.next/**",
      "**/coverage/**",
      "**/node_modules/**",
      "**/*.tsbuildinfo",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.mjs"],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [relativeWorkspaceImports],
        },
      ],
    },
  },
  {
    files: ["packages/domain/**/*.ts"],
    rules: {
      ...restricted({
        paths: [
          "@pa/application",
          "@pa/contracts",
          "@pa/config",
          "@pa/observability",
          "@pa/db",
          "@pa/ai",
          "@pa/audio",
          "@pa/storage",
          "@pa/queue",
          "@pa/ui",
          "@pa/testkit",
          "@pa/web",
          "@pa/worker",
        ],
        message:
          "Domain is the innermost layer and cannot import apps, adapters, frameworks, or other packages.",
      }),
      "no-restricted-properties": [
        "error",
        {
          object: "process",
          property: "env",
          message: "Domain cannot read environment variables.",
        },
      ],
    },
  },
  {
    files: ["packages/contracts/**/*.ts"],
    rules: restricted({
      paths: [
        "@pa/application",
        "@pa/config",
        "@pa/observability",
        "@pa/db",
        "@pa/ai",
        "@pa/audio",
        "@pa/storage",
        "@pa/queue",
        "@pa/ui",
        "@pa/testkit",
        "@pa/web",
        "@pa/worker",
      ],
      message: "Contracts may not import apps, adapters, or application code.",
    }),
  },
  {
    files: ["packages/application/**/*.ts"],
    rules: restricted({
      paths: [
        "@pa/config",
        "@pa/observability",
        "@pa/db",
        "@pa/ai",
        "@pa/audio",
        "@pa/storage",
        "@pa/queue",
        "@pa/ui",
        "@pa/testkit",
        "@pa/web",
        "@pa/worker",
      ],
      message: "Application use cases may import domain and contracts only.",
    }),
  },
  {
    files: ["packages/config/**/*.ts"],
    rules: restricted({
      paths: ["@pa/web", "@pa/worker", "@pa/ui", "@pa/testkit"],
      message: "Config cannot import apps or UI.",
    }),
  },
  {
    files: [
      "packages/observability/**/*.ts",
      "packages/db/**/*.ts",
      "packages/ai/**/*.ts",
      "packages/audio/**/*.ts",
      "packages/storage/**/*.ts",
      "packages/queue/**/*.ts",
    ],
    rules: restricted({
      paths: ["@pa/web", "@pa/worker", "@pa/ui", "@pa/testkit"],
      message: "Adapter packages cannot import apps, UI, or testkit.",
    }),
  },
  {
    files: ["packages/ui/**/*.{ts,tsx}"],
    rules: restricted({
      paths: [
        "@pa/application",
        "@pa/domain",
        "@pa/config",
        "@pa/observability",
        "@pa/db",
        "@pa/ai",
        "@pa/audio",
        "@pa/storage",
        "@pa/queue",
        "@pa/testkit",
        "@pa/web",
        "@pa/worker",
      ],
      allowedFrameworks: ["react", "react-dom"],
      message:
        "UI may import contracts for view types, not application, domain, adapters, or apps.",
    }),
  },
  {
    files: ["apps/web/**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@pa/worker",
              message: "The web app cannot import the worker or provider adapter packages.",
            },
            {
              name: "@pa/db",
              message: "The web app cannot import the worker or provider adapter packages.",
            },
            {
              name: "@pa/ai",
              message: "The web app cannot import the worker or provider adapter packages.",
            },
            {
              name: "@pa/audio",
              message: "The web app cannot import the worker or provider adapter packages.",
            },
            {
              name: "@pa/storage",
              message: "The web app cannot import the worker or provider adapter packages.",
            },
            {
              name: "@pa/queue",
              message: "The web app cannot import the worker or provider adapter packages.",
            },
            {
              name: "@pa/testkit",
              message: "The web app cannot import the worker or provider adapter packages.",
            },
          ],
          patterns: [relativeWorkspaceImports],
        },
      ],
    },
  },
  {
    files: ["apps/worker/**/*.ts"],
    rules: restricted({
      paths: ["@pa/web", "@pa/ui", "@pa/testkit"],
      message: "The worker cannot import the web app, UI package, or Next.js.",
    }),
  },
  prettier,
);
