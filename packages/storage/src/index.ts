import { APPLICATION_PACKAGE } from "@pa/application";
import { CONTRACTS_PACKAGE } from "@pa/contracts";

export const STORAGE_PACKAGE = {
  name: "@pa/storage",
  layer: "adapter",
  dependsOn: [APPLICATION_PACKAGE.name, CONTRACTS_PACKAGE.name],
} as const;
