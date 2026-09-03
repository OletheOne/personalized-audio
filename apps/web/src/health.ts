import { createHealthResponse } from "@pa/application";

export function getWebHealth() {
  return createHealthResponse("web");
}
