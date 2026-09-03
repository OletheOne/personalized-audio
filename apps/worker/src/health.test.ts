import { describe, expect, it } from "vitest";
import { DEFAULT_WORKER_HEALTH_PORT, resolveHealthPort, routeWorkerRequest } from "./health.js";

describe("resolveHealthPort", () => {
  it("uses the default port when unset", () => {
    expect(resolveHealthPort(undefined)).toBe(DEFAULT_WORKER_HEALTH_PORT);
    expect(resolveHealthPort("")).toBe(DEFAULT_WORKER_HEALTH_PORT);
    expect(resolveHealthPort("   ")).toBe(DEFAULT_WORKER_HEALTH_PORT);
  });

  it("accepts a valid boundary port", () => {
    expect(resolveHealthPort("1")).toBe(1);
    expect(resolveHealthPort("65535")).toBe(65535);
    expect(resolveHealthPort("3001")).toBe(3001);
  });

  it("rejects invalid ports", () => {
    expect(() => resolveHealthPort("0")).toThrow(/Invalid WORKER_HEALTH_PORT/);
    expect(() => resolveHealthPort("65536")).toThrow(/Invalid WORKER_HEALTH_PORT/);
    expect(() => resolveHealthPort("abc")).toThrow(/Invalid WORKER_HEALTH_PORT/);
    expect(() => resolveHealthPort("3001.5")).toThrow(/Invalid WORKER_HEALTH_PORT/);
  });
});

describe("routeWorkerRequest", () => {
  it("returns worker health for GET /health", () => {
    expect(routeWorkerRequest("GET", "/health")).toEqual({
      status: 200,
      body: { status: "ok", service: "worker" },
    });
  });

  it("treats a trailing slash as the same health route", () => {
    expect(routeWorkerRequest("GET", "/health/?fresh=1").status).toBe(200);
  });

  it("rejects unknown methods and paths", () => {
    expect(routeWorkerRequest("POST", "/health")).toEqual({
      status: 404,
      body: { error: "not_found" },
    });
    expect(routeWorkerRequest("GET", "/ready")).toEqual({
      status: 404,
      body: { error: "not_found" },
    });
  });
});
