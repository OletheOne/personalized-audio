import { APPLICATION_PACKAGE } from "@pa/application";
import { CONTRACTS_PACKAGE } from "@pa/contracts";
import { DOMAIN_PACKAGE } from "@pa/domain";

export const DB_PACKAGE = {
  name: "@pa/db",
  layer: "adapter",
  dependsOn: [APPLICATION_PACKAGE.name, CONTRACTS_PACKAGE.name, DOMAIN_PACKAGE.name],
} as const;
