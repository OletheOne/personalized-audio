import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HealthBadge } from "./health-badge.js";
import { UI_PACKAGE } from "./index.js";

describe("UI_PACKAGE", () => {
  it("identifies the shared UI layer", () => {
    expect(UI_PACKAGE).toEqual({
      name: "@pa/ui",
      layer: "ui",
    });
  });
});

describe("HealthBadge", () => {
  it("renders the health service without product chrome", () => {
    const html = renderToStaticMarkup(
      createElement(HealthBadge, { health: { status: "ok", service: "web" } }),
    );

    expect(html).toContain("web");
    expect(html).toContain("ok");
    expect(html).not.toContain("Create Episode");
  });
});
