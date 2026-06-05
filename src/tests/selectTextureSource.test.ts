import { describe, expect, it } from "vitest";
import { selectTextureSource } from "../utils/selectTextureSource";

describe("selectTextureSource", () => {
  it("prefers compressed textures when supported", () => {
    const source = selectTextureSource(
      [
        { src: "image.webp", format: "webp", quality: "high" },
        { src: "image.ktx2", format: "ktx2", quality: "high" },
      ],
      "high",
      { ktx2: true, webp: true },
    );

    expect(source?.src).toBe("image.ktx2");
  });

  it("falls back to WebP when KTX2 is unavailable", () => {
    const source = selectTextureSource(
      [
        { src: "image.png", format: "png", quality: "fallback" },
        { src: "image.ktx2", format: "ktx2", quality: "high" },
        { src: "image.webp", format: "webp", quality: "high" },
      ],
      "high",
      { ktx2: false, webp: true },
    );

    expect(source?.src).toBe("image.webp");
  });
});
