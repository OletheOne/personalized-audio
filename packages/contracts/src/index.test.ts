import { describe, expect, it } from "vitest";
import { CONTRACTS_PACKAGE, healthResponseSchema, packageIdentitySchema } from "./index.js";

describe("packageIdentitySchema", () => {
  it("accepts a complete identity", () => {
    expect(
      packageIdentitySchema.parse({
        name: "@pa/domain",
        layer: "domain",
      }),
    ).toEqual({
      name: "@pa/domain",
      layer: "domain",
    });
  });

  it("rejects an empty name", () => {
    const result = packageIdentitySchema.safeParse({
      name: "",
      layer: "domain",
    });

    expect(result.success).toBe(false);
  });

  it("rejects unknown properties", () => {
    const result = packageIdentitySchema.safeParse({
      name: "@pa/domain",
      layer: "domain",
      extra: true,
    });

    expect(result.success).toBe(false);
  });
});

describe("healthResponseSchema", () => {
  it("accepts the web and worker services", () => {
    expect(healthResponseSchema.parse({ status: "ok", service: "web" }).service).toBe("web");
    expect(healthResponseSchema.parse({ status: "ok", service: "worker" }).service).toBe("worker");
  });

  it("rejects an unknown service", () => {
    const result = healthResponseSchema.safeParse({ status: "ok", service: "api" });
    expect(result.success).toBe(false);
  });

  it("rejects unknown properties", () => {
    const result = healthResponseSchema.safeParse({
      status: "ok",
      service: "web",
      extra: true,
    });
    expect(result.success).toBe(false);
  });
});

describe("CONTRACTS_PACKAGE", () => {
  it("is a valid identity", () => {
    expect(CONTRACTS_PACKAGE).toEqual({
      name: "@pa/contracts",
      layer: "contracts",
    });
  });
});
