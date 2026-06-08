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
import type { MaterialFamily, TextureTilingConfig } from "../types/GalleryProject";
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

export interface ArchitecturalMaterialSurfaceSize {
  width: number;
  height: number;
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

const resolveAssetUrl = (url: string, assetBaseUrl?: string): string => {
  if (!assetBaseUrl || /^https?:\/\//.test(url) || url.startsWith("data:")) {
    return url;
  }

  return `${assetBaseUrl.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
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

const alignRepeatToCycle = (
  repeat: number,
  depth: number,
  cycleDepth: number | undefined,
): number => {
  if (!cycleDepth || !Number.isFinite(cycleDepth) || cycleDepth <= 0 || cycleDepth > depth) {
    return repeat;
  }

  const repeatsPerCycle = Math.max(1, Math.round(repeat * (cycleDepth / depth)));
  return repeatsPerCycle * (depth / cycleDepth);
};

const squareRepeatForSize = (
  fixedAxisRepeat: number,
  fixedAxisSize: number,
  adjustedAxisSize: number,
): number => fixedAxisRepeat * (adjustedAxisSize / Math.max(0.001, fixedAxisSize));

export const createProceduralArchitecturalMaterials = (
  quality: QualitySettings,
  depth: number,
  materialFamily: MaterialFamily,
  ceilingLightIntensity = 1,
  textureCycleDepth?: number,
  assetBaseUrl?: string,
  textureTiling?: TextureTilingConfig,
  surfaceSize: ArchitecturalMaterialSurfaceSize = { width: 5.4, height: 3.4 },
): Promise<ProceduralArchitecturalMaterials> => {
  const lightScale = Math.max(0, ceilingLightIntensity);
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
    loadTextureOrFallback(loader, resolveAssetUrl(config.colorUrl, assetBaseUrl), fallbackColor),
    loadTextureOrFallback(loader, resolveAssetUrl(config.normalUrl, assetBaseUrl), fallbackNormal),
  ]).then(([colorTexture, normalTexture]) => {
    const wallTiling = textureTiling?.wall ?? 1;
    const floorTiling = textureTiling?.floor ?? 1;
    const ceilingTiling = textureTiling?.ceiling ?? 1;
    const wallDeformation = textureTiling?.wallDeformation ?? "stretched";
    const floorDeformation = textureTiling?.floorDeformation ?? "stretched";
    const ceilingDeformation = textureTiling?.ceilingDeformation ?? "stretched";
    const wallRepeatX = alignRepeatToCycle(depthRepeat * config.wallRepeatScale * wallTiling, depth, textureCycleDepth);
    const wallRepeatY = wallDeformation === "square"
      ? squareRepeatForSize(wallRepeatX, depth, surfaceSize.height)
      : (family === "brick" ? 3.2 : family === "wood" ? 2.4 : 2) * wallTiling;
    const floorRepeatY = alignRepeatToCycle(depthRepeat * config.floorRepeatScale * floorTiling, depth, textureCycleDepth);
    const floorRepeatX = floorDeformation === "square"
      ? squareRepeatForSize(floorRepeatY, depth, surfaceSize.width)
      : 8 * floorTiling;
    const ceilingRepeatY = alignRepeatToCycle(
      depthRepeat * config.ceilingRepeatScale * ceilingTiling,
      depth,
      textureCycleDepth,
    );
    const ceilingRepeatX = ceilingDeformation === "square"
      ? squareRepeatForSize(ceilingRepeatY, depth, surfaceSize.width)
      : 8 * ceilingTiling;

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
        0.2 * lightScale,
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
        0.16 * lightScale,
      ),
      trim: new MeshStandardMaterial({
        color: "#11100d",
        roughness: 0.48,
        metalness: 0.2,
      }),
      led: new MeshBasicMaterial({
        color: new Color("#fff8df").multiplyScalar(lightScale),
        toneMapped: false,
      }),
      bounce: new MeshBasicMaterial({
        color: "#e0b67a",
        transparent: true,
        opacity: (quality.preset === "low" ? 0.12 : 0.2) * lightScale,
        depthWrite: false,
        toneMapped: false,
      }),
      wallWash: new MeshBasicMaterial({
        color: "#d7985f",
        transparent: true,
        opacity: (quality.preset === "low" ? 0.18 : 0.34) * lightScale,
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
        color: new Color("#fff6df").multiplyScalar(lightScale),
        toneMapped: false,
      }),
    };
  });
};
