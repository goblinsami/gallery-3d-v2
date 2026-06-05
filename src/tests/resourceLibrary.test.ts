import { describe, expect, it } from "vitest";
import { ResourceLibrary } from "../core/ResourceLibrary";

describe("ResourceLibrary", () => {
  it("reuses matching material instances", () => {
    const resources = new ResourceLibrary();

    expect(resources.getBasicSurface("#fff")).toBe(resources.getBasicSurface("#fff"));
    expect(resources.getGlow("#d4b26a", 0.16)).toBe(resources.getGlow("#d4b26a", 0.16));
    expect(resources.getStandardSurface("#222", 0.5, 0.1)).toBe(
      resources.getStandardSurface("#222", 0.5, 0.1),
    );
  });

  it("exposes shared unit geometries", () => {
    const resources = new ResourceLibrary();

    expect(resources.unitPlane).toBe(resources.unitPlane);
    expect(resources.unitBox).toBe(resources.unitBox);
  });
});
