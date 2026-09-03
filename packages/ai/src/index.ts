import { APPLICATION_PACKAGE } from "@pa/application";
import { CONTRACTS_PACKAGE } from "@pa/contracts";

export const AI_PACKAGE = {
  name: "@pa/ai",
  layer: "adapter",
  dependsOn: [APPLICATION_PACKAGE.name, CONTRACTS_PACKAGE.name],
} as const;
