import { describe, expect, it } from "vitest";
import { CONFIG_PACKAGE } from "./index.js";

describe("CONFIG_PACKAGE", () => {
  it("identifies the config skeleton without reading secrets", () => {
    expect(CONFIG_PACKAGE).toEqual({
      name: "@pa/config",
      layer: "config",
    });
  });
});
