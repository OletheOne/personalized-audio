import { describe, expect, it } from "vitest";
import { DOMAIN_PACKAGE } from "./index.js";

describe("DOMAIN_PACKAGE", () => {
  it("identifies the innermost workspace layer", () => {
    expect(DOMAIN_PACKAGE).toEqual({
      name: "@pa/domain",
      layer: "domain",
    });
  });
});
