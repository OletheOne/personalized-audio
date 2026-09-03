import { z } from "zod";

export const packageLayerSchema = z.enum([
  "domain",
  "contracts",
  "application",
  "adapter",
  "ui",
  "config",
  "testkit",
  "app",
]);

export const packageIdentitySchema = z.strictObject({
  name: z.string().min(1),
  layer: packageLayerSchema,
});

export const healthServiceSchema = z.enum(["web", "worker"]);

export const healthResponseSchema = z.strictObject({
  status: z.literal("ok"),
  service: healthServiceSchema,
});

export type PackageLayer = z.infer<typeof packageLayerSchema>;
export type PackageIdentity = z.infer<typeof packageIdentitySchema>;
export type HealthService = z.infer<typeof healthServiceSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const CONTRACTS_PACKAGE = packageIdentitySchema.parse({
  name: "@pa/contracts",
  layer: "contracts",
});
