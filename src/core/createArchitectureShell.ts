import {
  AmbientLight,
  BoxGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  InstancedMesh,
  Matrix4,
  Mesh,
  PlaneGeometry,
  RectAreaLight,
} from "three";
import type { LayoutConfig, MaterialFamily, TextureTilingConfig } from "../types/GalleryProject";
import type { QualitySettings } from "../types/Quality";
import { createArchitecturalBake } from "../lighting/ArchitecturalBake";
import type { ProceduralArchitecturalMaterials } from "./createProceduralArchitecturalMaterials";
import { createProceduralArchitecturalMaterials } from "./createProceduralArchitecturalMaterials";
import { getArchitecturalModulePattern } from "../utils/architecturalModules";

const CEILING_FILL_LIGHT_WIDTH_SCALE = 0.92;
const CEILING_FILL_LIGHT_DEPTH_SCALE = 1.04;
const CEILING_FILL_LIGHT_INSET = 0.38;

export const createArchitectureShell = async (
  layout: LayoutConfig,
  quality: QualitySettings,
  materialFamily: MaterialFamily,
  ceilingLightIntensity = 1,
  ceilingLightRadius = 0.095,
  ceilingLightColor = "#fff6df",
  ledColor = "#fff8df",
  textureCycleDepth?: number,
  assetBaseUrl?: string,
  textureTiling?: TextureTilingConfig,
): Promise<Group> => {
  const root = new Group();
  const width = layout.bounds?.width ?? 5.4;
  const height = layout.bounds?.height ?? 3.4;
  const depth = Math.max(layout.bounds?.depth ?? 44, 20);
  const lightScale = Math.max(0, ceilingLightIntensity);
  const materials = await createProceduralArchitecturalMaterials(
    quality,
    depth,
    materialFamily,
    lightScale,
    ceilingLightColor,
    ledColor,
    textureCycleDepth,
    assetBaseUrl,
    textureTiling,
    { width, height },
  );
  const floor = new Mesh(new PlaneGeometry(width, depth), materials.floor);
  const floorBase = new Mesh(new BoxGeometry(width, 0.04, depth), materials.trim);
  const ceiling = new Mesh(new PlaneGeometry(width, depth), materials.ceiling);
  const leftWall = new Mesh(new PlaneGeometry(depth, height), materials.wall);
  const rightWall = new Mesh(new PlaneGeometry(depth, height), materials.wall);
  const ambient = new AmbientLight("#f4ead9", quality.preset === "low" ? 0.36 : 0.52);
  const hemisphere = new HemisphereLight("#fff4dc", "#5b452d", (quality.preset === "low" ? 0.64 : 0.9) * lightScale);
  const key = new DirectionalLight("#fff2d7", (quality.lightBudget > 1 ? 1.32 : 0.84) * lightScale);

  floor.position.set(0, 0.002, -depth / 2);
  floor.rotation.x = -Math.PI / 2;
  floorBase.position.set(0, -0.022, -depth / 2);
  ceiling.position.set(0, height, -depth / 2);
  ceiling.rotation.x = Math.PI / 2;
  leftWall.position.set(-width / 2, height / 2, -depth / 2);
  leftWall.rotation.y = Math.PI / 2;
  rightWall.position.set(width / 2, height / 2, -depth / 2);
  rightWall.rotation.y = -Math.PI / 2;
  key.position.set(-1.8, height - 0.45, 2.8);
  floor.receiveShadow = true;
  floorBase.receiveShadow = true;
  ceiling.receiveShadow = true;
  leftWall.receiveShadow = true;
  rightWall.receiveShadow = true;

  root.name = "architecture-shell";
  root.add(floorBase, floor, ceiling, leftWall, rightWall, ambient, hemisphere, key);
  const ceilingFill = createCeilingFillLight(width, depth, height, lightScale, ceilingLightColor);
  if (ceilingFill) {
    root.add(ceilingFill);
  }
  root.add(createLongLeds(width, depth, height, materials));
  root.add(createFloorLeds(width, depth, materials));
  root.add(createWallLeds(width, depth, height, materials, quality, textureCycleDepth));
  root.add(createCeilingGrid(width, depth, height, materials, quality, textureCycleDepth));
  root.add(createCeilingDownlights(width, depth, height, materials, quality, ceilingLightRadius, textureCycleDepth));
  root.add(createArchitecturalBake(
    width,
    depth,
    height,
    quality,
    lightScale,
    ceilingLightColor,
    ledColor,
    textureCycleDepth,
  ));

  return root;
};

const getWallLedXs = (width: number): [number, number] => [-width / 2 + 0.028, width / 2 - 0.028];
const getLightGridXs = (width: number): [number, number, number] => [-width * 0.43, 0, width * 0.43];

const createCeilingFillLight = (
  width: number,
  depth: number,
  height: number,
  lightScale: number,
  ceilingLightColor: string,
): RectAreaLight | null => {
  if (lightScale <= 0) {
    return null;
  }

  const [leftGridX, , rightGridX] = getLightGridXs(width);
  const gridWidth = rightGridX - leftGridX;
  const light = new RectAreaLight(
    ceilingLightColor,
    lightScale * 0.65,
    gridWidth * CEILING_FILL_LIGHT_WIDTH_SCALE,
    depth * CEILING_FILL_LIGHT_DEPTH_SCALE,
  );
  light.name = "ceiling-fill-light";
  light.position.set(0, height - CEILING_FILL_LIGHT_INSET, -depth / 2);
  light.lookAt(0, height, -depth / 2);
  return light;
};

const createCeilingGrid = (
  width: number,
  depth: number,
  height: number,
  materials: ProceduralArchitecturalMaterials,
  quality: QualitySettings,
  textureCycleDepth?: number,
): Group => {
  const root = new Group();
  const railWidth = 0.035;
  const modulePattern = getArchitecturalModulePattern(depth, quality.geometryDetail, textureCycleDepth);
  const moduleZs = modulePattern.positions;
  const longitudinalXs = getLightGridXs(width);
  const [leftWallLedX, rightWallLedX] = getWallLedXs(width);
  const [leftGridX, , rightGridX] = longitudinalXs;
  const gridY = height - railWidth * 0.5;
  const crossRailWidth = rightGridX - leftGridX;
  const crossRailCenterX = leftGridX + crossRailWidth / 2;
  const sideConnectorWidth = Math.abs(leftGridX - leftWallLedX);
  const matrix = new Matrix4();
  const crossRails = new InstancedMesh(
    new BoxGeometry(crossRailWidth, railWidth, railWidth),
    materials.trim,
    moduleZs.length,
  );
  const longitudinalRails = new InstancedMesh(
    new BoxGeometry(railWidth, railWidth, depth),
    materials.trim,
    longitudinalXs.length,
  );
  const sideConnectors = new InstancedMesh(
    new BoxGeometry(sideConnectorWidth, railWidth, railWidth),
    materials.trim,
    moduleZs.length * 2,
  );

  moduleZs.forEach((z, index) => {
    matrix.makeTranslation(crossRailCenterX, gridY, z);
    crossRails.setMatrixAt(index, matrix);
  });

  longitudinalXs.forEach((x, index) => {
    matrix.makeTranslation(x, gridY, -depth / 2);
    longitudinalRails.setMatrixAt(index, matrix);
  });

  moduleZs.forEach((z, index) => {
    matrix.makeTranslation((leftWallLedX + leftGridX) / 2, gridY, z);
    sideConnectors.setMatrixAt(index * 2, matrix);
    matrix.makeTranslation((rightWallLedX + rightGridX) / 2, gridY, z);
    sideConnectors.setMatrixAt(index * 2 + 1, matrix);
  });

  crossRails.instanceMatrix.needsUpdate = true;
  longitudinalRails.instanceMatrix.needsUpdate = true;
  sideConnectors.instanceMatrix.needsUpdate = true;
  root.name = "ceiling-grid";
  root.add(longitudinalRails, crossRails, sideConnectors);
  return root;
};

const createLongLeds = (
  width: number,
  depth: number,
  height: number,
  materials: ProceduralArchitecturalMaterials,
): Group => {
  const root = new Group();
  const horizontal = new BoxGeometry(0.04, 0.04, depth);
  const [leftX, rightX] = getWallLedXs(width);
  const topY = height - 0.02;
  const positions = [
    [leftX, topY, -depth / 2],
    [rightX, topY, -depth / 2],
  ] as const;

  positions.forEach(([x, y, z], index) => {
    const led = new Mesh(horizontal, materials.led);
    led.position.set(x, y, z);
    led.name = `corridor-long-led-${index}`;
    root.add(led);
  });

  root.name = "corridor-long-leds";
  return root;
};

const createFloorLeds = (
  width: number,
  depth: number,
  materials: ProceduralArchitecturalMaterials,
): Group => {
  const root = new Group();
  const ledGeometry = new BoxGeometry(0.036, 0.036, depth);
  const [leftX, rightX] = getWallLedXs(width);
  const floorY = 0.018;
  const positions = [
    [leftX, floorY, -depth / 2],
    [rightX, floorY, -depth / 2],
  ] as const;

  positions.forEach(([x, y, z], index) => {
    const led = new Mesh(ledGeometry, materials.led);
    led.position.set(x, y, z);
    led.name = `corridor-floor-led-${index}`;
    root.add(led);
  });

  root.name = "corridor-floor-leds";
  return root;
};

const createWallLeds = (
  width: number,
  depth: number,
  height: number,
  materials: ProceduralArchitecturalMaterials,
  quality: QualitySettings,
  textureCycleDepth?: number,
): Group => {
  const root = new Group();
  const moduleZs = getArchitecturalModulePattern(depth, quality.geometryDetail, textureCycleDepth).positions;
  const matrix = new Matrix4();
  const bottomY = 0;
  const topY = height;
  const stripHeight = topY - bottomY;
  const [leftX, rightX] = getWallLedXs(width);
  const strip = new InstancedMesh(
    new BoxGeometry(0.032, stripHeight, 0.032),
    materials.led,
    moduleZs.length * 2,
  );
  const centerY = bottomY + stripHeight / 2;

  moduleZs.forEach((z, index) => {
    matrix.makeTranslation(leftX, centerY, z);
    strip.setMatrixAt(index * 2, matrix);
    matrix.makeTranslation(rightX, centerY, z);
    strip.setMatrixAt(index * 2 + 1, matrix);
  });

  strip.instanceMatrix.needsUpdate = true;
  root.name = "wall-led-strips";
  root.add(strip);
  return root;
};

const createCeilingDownlights = (
  width: number,
  depth: number,
  height: number,
  materials: ProceduralArchitecturalMaterials,
  quality: QualitySettings,
  ceilingLightRadius: number,
  textureCycleDepth?: number,
): Group => {
  const root = new Group();
  const moduleZs = getArchitecturalModulePattern(depth, quality.geometryDetail, textureCycleDepth).positions;
  const xPositions = getLightGridXs(width);
  const total = xPositions.length * moduleZs.length;
  const trimRadius = Math.max(0.04, ceilingLightRadius);
  const coreRadius = trimRadius * (0.052 / 0.095);
  const trim = new InstancedMesh(new CylinderGeometry(trimRadius, trimRadius, 0.033, 20), materials.fixtureTrim, total);
  const core = new InstancedMesh(new CylinderGeometry(coreRadius, coreRadius, 0.037, 16), materials.fixtureCore, total);
  const matrix = new Matrix4();

  xPositions.forEach((x, rowIndex) => {
    moduleZs.forEach((z, index) => {
      const instance = rowIndex * moduleZs.length + index;
      matrix.makeTranslation(x, height - 0.072, z);
      trim.setMatrixAt(instance, matrix);
      matrix.makeTranslation(x, height - 0.096, z);
      core.setMatrixAt(instance, matrix);
    });
  });

  trim.instanceMatrix.needsUpdate = true;
  core.instanceMatrix.needsUpdate = true;
  root.name = "ceiling-downlights";
  root.add(trim, core);
  return root;
};
