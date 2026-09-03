import { APPLICATION_PACKAGE } from "@pa/application";
import { CONTRACTS_PACKAGE } from "@pa/contracts";

export const QUEUE_PACKAGE = {
  name: "@pa/queue",
  layer: "adapter",
  dependsOn: [APPLICATION_PACKAGE.name, CONTRACTS_PACKAGE.name],
} as const;
