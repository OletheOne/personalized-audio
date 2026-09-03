import { describe, expect, it } from "vitest";
import { getWebHealth } from "./health";

describe("getWebHealth", () => {
  it("returns the web process health payload", () => {
    expect(getWebHealth()).toEqual({ status: "ok", service: "web" });
  });
});
