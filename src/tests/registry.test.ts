import { describe, expect, it } from "vitest";
import { Registry } from "../core/Registry";

describe("Registry", () => {
  it("resolves registered entries by type", () => {
    const registry = new Registry<{ readonly type: string; value: number }>();
    registry.register({ type: "statement", value: 1 });

    expect(registry.get("statement").value).toBe(1);
    expect(registry.has("statement")).toBe(true);
  });

  it("rejects duplicate entries", () => {
    const registry = new Registry<{ readonly type: string }>();
    registry.register({ type: "quote" });

    expect(() => registry.register({ type: "quote" })).toThrow("Duplicate registry entry");
  });
});
