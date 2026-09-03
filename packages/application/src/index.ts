import { CONTRACTS_PACKAGE, healthResponseSchema, type HealthResponse } from "@pa/contracts";
import { DOMAIN_PACKAGE } from "@pa/domain";

export const APPLICATION_PACKAGE = {
  name: "@pa/application",
  layer: "application",
  dependsOn: [DOMAIN_PACKAGE.name, CONTRACTS_PACKAGE.name],
} as const;

export function createHealthResponse(service: HealthResponse["service"]): HealthResponse {
  return healthResponseSchema.parse({ status: "ok", service });
}
