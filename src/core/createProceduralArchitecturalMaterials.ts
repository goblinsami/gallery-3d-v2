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
import type { MaterialFamily } from "../types/GalleryProject";
import {
  TEXTURE_LIBRARY,
  drawBrickColorTexture,
  drawBrickNormalTexture,
  drawStoneTexture,
  drawWoodTexture,
  resolveTextureFamily,
} from "./architecturalTextureFamilies";

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

const textureSizeForQuality = (quality: QualitySettings): number => {
  if (quality.preset === "low") {
    return 384;
  }

  return quality.preset === "medium" ? 512 : 768;
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

const createTexturedMaterial = (
  color: string,
  roughness: number,
  repeatX: number,
  repeatY: number,
  colorTexture: Texture,
  normalTexture: Texture,
  normalScale: number,
  emissive: string,
  emissiveIntensity: number,
): MeshStandardMaterial => new MeshStandardMaterial({
  color,
  map: createRepeatedTexture(colorTexture, repeatX, repeatY, SRGBColorSpace),
  normalMap: createRepeatedTexture(normalTexture, repeatX, repeatY, NoColorSpace),
  normalScale: new Vector2(normalScale, normalScale),
  roughness,
  metalness: 0,
  emissive: new Color(emissive),
  emissiveIntensity,
});

export const createProceduralArchitecturalMaterials = (
  quality: QualitySettings,
  depth: number,
  materialFamily: MaterialFamily,
): Promise<ProceduralArchitecturalMaterials> => {
  const textureSize = textureSizeForQuality(quality);
  const legacySegmentLength = 12;
  const depthRepeat = Math.max(1, depth / legacySegmentLength);
  const family = resolveTextureFamily(materialFamily);
  const config = TEXTURE_LIBRARY[family];
  const fallbackColor = family === "brick"
    ? drawBrickColorTexture(textureSize)
    : family === "wood"
      ? drawWoodTexture(textureSize)
      : drawStoneTexture(textureSize);
  const fallbackNormal = family === "brick" ? drawBrickNormalTexture(textureSize) : fallbackColor;
  const loader = new TextureLoader();

  return Promise.all([
    loadTextureOrFallback(loader, config.colorUrl, fallbackColor),
    loadTextureOrFallback(loader, config.normalUrl, fallbackNormal),
  ]).then(([colorTexture, normalTexture]) => {
    const wallRepeatX = depthRepeat * config.wallRepeatScale;
    const wallRepeatY = family === "brick" ? 3.2 : family === "wood" ? 2.4 : 2;
    const floorRepeatX = 8;
    const floorRepeatY = depthRepeat * config.floorRepeatScale;
    const ceilingRepeatX = 8;
    const ceilingRepeatY = depthRepeat * config.ceilingRepeatScale;

    return {
      wall: createTexturedMaterial(
        config.tint,
        0.86,
        wallRepeatX,
        wallRepeatY,
        colorTexture,
        normalTexture,
        config.normalScale,
        config.emissive,
        0.18,
      ),
      wallAccent: createTexturedMaterial(
        config.tint,
        0.86,
        wallRepeatX,
        wallRepeatY,
        colorTexture,
        normalTexture,
        config.normalScale * 0.82,
        config.emissive,
        0.12,
      ),
      floor: createTexturedMaterial(
        config.tint,
        0.74,
        floorRepeatX,
        floorRepeatY,
        colorTexture,
        normalTexture,
        config.normalScale * 0.9,
        config.emissive,
        0.1,
      ),
      floorAccent: new MeshStandardMaterial({
        color: config.accent,
        roughness: 0.82,
        metalness: 0.03,
        emissive: "#201810",
        emissiveIntensity: 0.18,
      }),
      ceiling: createTexturedMaterial(
        config.tint,
        0.84,
        ceilingRepeatX,
        ceilingRepeatY,
        colorTexture,
        normalTexture,
        config.normalScale * 0.58,
        config.emissive,
        0.2,
      ),
      ceilingAccent: createTexturedMaterial(
        config.tint,
        0.84,
        ceilingRepeatX,
        ceilingRepeatY,
        colorTexture,
        normalTexture,
        config.normalScale * 0.5,
        config.emissive,
        0.16,
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
