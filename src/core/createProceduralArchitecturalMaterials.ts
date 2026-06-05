import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  LinearFilter,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NoColorSpace,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  type Texture,
} from "three";
import type { QualitySettings } from "../types/Quality";

export interface ProceduralArchitecturalMaterials {
  wall: MeshStandardMaterial;
  wallAccent: MeshStandardMaterial;
  floor: MeshStandardMaterial;
  floorAccent: MeshStandardMaterial;
  ceiling: MeshStandardMaterial;
  ceilingAccent: MeshStandardMaterial;
  trim: MeshStandardMaterial;
  led: MeshBasicMaterial;
  bounce: MeshBasicMaterial;
  wallWash: MeshBasicMaterial;
  fixtureTrim: MeshStandardMaterial;
  fixtureCore: MeshBasicMaterial;
}

const LEGACY_STONE_COLOR_URL = "/textures/stone/stone_color.jpg";
const LEGACY_STONE_NORMAL_URL = "/textures/stone/stone_normal.jpg";

const textureSizeForQuality = (quality: QualitySettings): number => {
  if (quality.preset === "low") {
    return 384;
  }

  return quality.preset === "medium" ? 512 : 768;
};

const createTextureCanvas = (
  size: number,
): { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Cannot create procedural architectural texture.");
  }

  return { canvas, context };
};

const createCanvasTexture = (
  canvas: HTMLCanvasElement,
  repeatX: number,
  repeatY: number,
): CanvasTexture => {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
};

const createRepeatedTexture = (
  source: Texture,
  repeatX: number,
  repeatY: number,
  colorSpace: typeof SRGBColorSpace | typeof NoColorSpace,
): Texture => {
  const texture = source.clone();
  texture.colorSpace = colorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
};

const drawWoodTexture = (size: number): HTMLCanvasElement => {
  const { canvas, context } = createTextureCanvas(size);
  const gradient = context.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "#8a6540");
  gradient.addColorStop(0.5, "#5a3d25");
  gradient.addColorStop(1, "#9b7046");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += 1) {
    const wave = Math.sin(y * 0.035) * 8 + Math.sin(y * 0.011) * 18;
    context.globalAlpha = 0.12 + (Math.sin(y * 0.09) + 1) * 0.035;
    context.strokeStyle = y % 13 === 0 ? "#c0925d" : "#3b2919";
    context.beginPath();
    context.moveTo(0, y + wave * 0.05);
    context.bezierCurveTo(size * 0.32, y + wave, size * 0.68, y - wave, size, y + wave * 0.12);
    context.stroke();
  }

  context.globalAlpha = 0.16;
  context.fillStyle = "#2a1d12";
  for (let x = 0; x < size; x += size / 4) {
    context.fillRect(x, 0, 2, size);
  }
  context.globalAlpha = 1;
  return canvas;
};

const drawStoneTexture = (size: number): HTMLCanvasElement => {
  const { canvas, context } = createTextureCanvas(size);
  context.fillStyle = "#2b2721";
  context.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += 6) {
    const tone = 36 + Math.round((Math.sin(y * 0.04) + 1) * 18);
    context.strokeStyle = `rgb(${tone + 16}, ${tone + 10}, ${tone})`;
    context.globalAlpha = 0.12;
    context.beginPath();
    context.moveTo(0, y);
    context.bezierCurveTo(size * 0.26, y - 18, size * 0.58, y + 22, size, y - 8);
    context.stroke();
  }

  context.globalAlpha = 0.22;
  context.strokeStyle = "#0f0d0a";
  for (let x = size / 3; x < size; x += size / 3) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + Math.sin(x) * 8, size);
    context.stroke();
  }
  context.globalAlpha = 1;
  return canvas;
};

const loadTextureOrFallback = async (
  loader: TextureLoader,
  url: string,
  fallbackCanvas: HTMLCanvasElement,
): Promise<Texture> => {
  try {
    const texture = await loader.loadAsync(url);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.needsUpdate = true;
    return texture;
  } catch {
    return createCanvasTexture(fallbackCanvas, 1, 1);
  }
};

const createStoneMaterial = (
  color: string,
  roughness: number,
  repeatX: number,
  repeatY: number,
  colorTexture: Texture,
  normalTexture: Texture,
  normalScale: number,
  emissiveIntensity: number,
): MeshStandardMaterial => new MeshStandardMaterial({
  color,
  map: createRepeatedTexture(colorTexture, repeatX, repeatY, SRGBColorSpace),
  normalMap: createRepeatedTexture(normalTexture, repeatX, repeatY, NoColorSpace),
  normalScale: new Vector2(normalScale, normalScale),
  roughness,
  metalness: 0,
  emissive: new Color("#2a2118"),
  emissiveIntensity,
});

export const createProceduralArchitecturalMaterials = (
  quality: QualitySettings,
  depth: number,
): Promise<ProceduralArchitecturalMaterials> => {
  const textureSize = textureSizeForQuality(quality);
  const legacySegmentLength = 12;
  const depthRepeat = Math.max(1, depth / legacySegmentLength);
  const stone = drawStoneTexture(textureSize);
  const loader = new TextureLoader();

  return Promise.all([
    loadTextureOrFallback(loader, LEGACY_STONE_COLOR_URL, stone),
    loadTextureOrFallback(loader, LEGACY_STONE_NORMAL_URL, stone),
  ]).then(([colorTexture, normalTexture]) => {
    const wallRepeatX = depthRepeat * 1.35;
    const wallRepeatY = 2;
    const floorRepeatX = 8;
    const floorRepeatY = depthRepeat * 1.3;
    const ceilingRepeatX = 8;
    const ceilingRepeatY = depthRepeat * 1.1;

    return {
      wall: createStoneMaterial("#ffffff", 0.86, wallRepeatX, wallRepeatY, colorTexture, normalTexture, 0.72, 0.18),
      wallAccent: createStoneMaterial(
        "#ffffff",
        0.86,
        wallRepeatX,
        wallRepeatY,
        colorTexture,
        normalTexture,
        0.58,
        0.12,
      ),
      floor: createStoneMaterial("#ffffff", 0.74, floorRepeatX, floorRepeatY, colorTexture, normalTexture, 0.64, 0.1),
      floorAccent: new MeshStandardMaterial({
        color: "#6d5b43",
        roughness: 0.82,
        metalness: 0.03,
        emissive: "#201810",
        emissiveIntensity: 0.18,
      }),
      ceiling: createStoneMaterial("#ffffff", 0.84, ceilingRepeatX, ceilingRepeatY, colorTexture, normalTexture, 0.42, 0.14),
      ceilingAccent: createStoneMaterial(
        "#ffffff",
        0.84,
        ceilingRepeatX,
        ceilingRepeatY,
        colorTexture,
        normalTexture,
        0.36,
        0.12,
      ),
      trim: new MeshStandardMaterial({
        color: "#11100d",
        roughness: 0.48,
        metalness: 0.2,
      }),
      led: new MeshBasicMaterial({
        color: "#fff8df",
        toneMapped: false,
      }),
      bounce: new MeshBasicMaterial({
        color: "#e0b67a",
        transparent: true,
        opacity: quality.preset === "low" ? 0.12 : 0.2,
        depthWrite: false,
        toneMapped: false,
      }),
      wallWash: new MeshBasicMaterial({
        color: "#d7985f",
        transparent: true,
        opacity: quality.preset === "low" ? 0.18 : 0.34,
        blending: AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
      fixtureTrim: new MeshStandardMaterial({
        color: "#0c0b09",
        roughness: 0.42,
        metalness: 0.3,
      }),
      fixtureCore: new MeshBasicMaterial({
        color: "#fff6df",
        toneMapped: false,
      }),
    };
  });
};
