import { createHealthResponse } from "@pa/application";

export const DEFAULT_WORKER_HEALTH_PORT = 3001;

export function resolveHealthPort(rawPort: string | undefined): number {
  if (rawPort === undefined || rawPort.trim() === "") {
    return DEFAULT_WORKER_HEALTH_PORT;
  }

  const port = Number(rawPort);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid WORKER_HEALTH_PORT: ${rawPort}`);
  }

  return port;
}

export function routeWorkerRequest(method: string, url: string): { status: number; body: unknown } {
  const path = url.split("?")[0] ?? "/";
  if (method === "GET" && (path === "/health" || path === "/health/")) {
    return { status: 200, body: createHealthResponse("worker") };
  }

  return { status: 404, body: { error: "not_found" } };
}
