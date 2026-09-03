import { healthResponseSchema } from "@pa/contracts";
import { describe, expect, it } from "vitest";
import { APPLICATION_PACKAGE, createHealthResponse } from "./index.js";

describe("APPLICATION_PACKAGE", () => {
  it("depends on domain and contracts only", () => {
    expect(APPLICATION_PACKAGE.dependsOn).toEqual(["@pa/domain", "@pa/contracts"]);
  });
});

describe("createHealthResponse", () => {
  it("returns a validated health payload", () => {
    expect(createHealthResponse("web")).toEqual({ status: "ok", service: "web" });
    expect(createHealthResponse("worker")).toEqual({ status: "ok", service: "worker" });
  });

  it("rejects payloads that bypass the application function", () => {
    const result = healthResponseSchema.safeParse({ status: "error", service: "web" });
    expect(result.success).toBe(false);
  });
});
