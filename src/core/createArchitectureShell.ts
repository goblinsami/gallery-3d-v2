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
} from "three";
import type { LayoutConfig } from "../types/GalleryProject";
import type { QualitySettings } from "../types/Quality";
import { createArchitecturalBake } from "../lighting/ArchitecturalBake";
import type { ProceduralArchitecturalMaterials } from "./createProceduralArchitecturalMaterials";
import { createProceduralArchitecturalMaterials } from "./createProceduralArchitecturalMaterials";

export const createArchitectureShell = async (
  layout: LayoutConfig,
  quality: QualitySettings,
): Promise<Group> => {
  const root = new Group();
  const width = layout.bounds?.width ?? 5.4;
  const height = layout.bounds?.height ?? 3.4;
  const depth = Math.max(layout.bounds?.depth ?? 44, 20);
  const materials = await createProceduralArchitecturalMaterials(quality, depth);
  const floor = new Mesh(new PlaneGeometry(width, depth), materials.floor);
  const floorBase = new Mesh(new BoxGeometry(width, 0.04, depth), materials.trim);
  const ceiling = new Mesh(new PlaneGeometry(width, depth), materials.ceiling);
  const leftWall = new Mesh(new PlaneGeometry(depth, height), materials.wall);
  const rightWall = new Mesh(new PlaneGeometry(depth, height), materials.wall);
  const ambient = new AmbientLight("#f4ead9", quality.preset === "low" ? 0.32 : 0.46);
  const hemisphere = new HemisphereLight("#fff4dc", "#5b452d", quality.preset === "low" ? 0.58 : 0.82);
  const key = new DirectionalLight("#fff2d7", quality.lightBudget > 1 ? 1.24 : 0.78);

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
  root.add(createLongLeds(width, depth, height, materials));
  root.add(createFloorLeds(width, depth, materials));
  root.add(createWallLeds(width, depth, height, materials, quality));
  root.add(createCeilingGrid(width, depth, height, materials, quality));
  root.add(createCeilingDownlights(width, depth, height, materials, quality));
  root.add(createArchitecturalBake(width, depth, height, quality));

  return root;
};

const getModuleCount = (depth: number, quality: QualitySettings): number =>
  Math.max(8, Math.round(depth / (quality.geometryDetail > 0.75 ? 4.2 : 5.6)));

const getModuleZ = (depth: number, count: number, index: number): number =>
  -0.16 - index * ((depth - 0.32) / Math.max(1, count - 1));

const createCeilingGrid = (
  width: number,
  depth: number,
  height: number,
  materials: ProceduralArchitecturalMaterials,
  quality: QualitySettings,
): Group => {
  const root = new Group();
  const railWidth = 0.035;
  const crossCount = getModuleCount(depth, quality);
  const longitudinalXs = [-width * 0.43, 0, width * 0.43];
  const matrix = new Matrix4();
  const crossRails = new InstancedMesh(new BoxGeometry(width, railWidth, railWidth), materials.trim, crossCount);
  const longitudinalRails = new InstancedMesh(
    new BoxGeometry(railWidth, railWidth, depth),
    materials.trim,
    longitudinalXs.length,
  );

  for (let index = 0; index < crossCount; index += 1) {
    const z = getModuleZ(depth, crossCount, index);
    matrix.makeTranslation(0, height - railWidth * 0.5 - 0.014, z);
    crossRails.setMatrixAt(index, matrix);
  }

  longitudinalXs.forEach((x, index) => {
    matrix.makeTranslation(x, height - railWidth * 0.5 - 0.018, -depth / 2);
    longitudinalRails.setMatrixAt(index, matrix);
  });

  crossRails.instanceMatrix.needsUpdate = true;
  longitudinalRails.instanceMatrix.needsUpdate = true;
  root.name = "ceiling-grid";
  root.add(longitudinalRails, crossRails);
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
  const positions = [
    [-width / 2 + 0.08, height - 0.18, -depth / 2],
    [width / 2 - 0.08, height - 0.18, -depth / 2],
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
  const positions = [
    [-width / 2 + 0.08, 0.07, -depth / 2],
    [width / 2 - 0.08, 0.07, -depth / 2],
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
): Group => {
  const root = new Group();
  const count = getModuleCount(depth, quality);
  const matrix = new Matrix4();
  const strip = new InstancedMesh(
    new BoxGeometry(0.032, height - 0.12, 0.032),
    materials.led,
    count * 2,
  );

  for (let index = 0; index < count; index += 1) {
    const z = getModuleZ(depth, count, index);
    matrix.makeTranslation(-width / 2 + 0.028, height / 2, z);
    strip.setMatrixAt(index * 2, matrix);
    matrix.makeTranslation(width / 2 - 0.028, height / 2, z);
    strip.setMatrixAt(index * 2 + 1, matrix);
  }

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
): Group => {
  const root = new Group();
  const rows = quality.preset === "low" ? 1 : 2;
  const countZ = Math.max(5, Math.round(depth / 8));
  const total = rows * countZ;
  const trim = new InstancedMesh(new CylinderGeometry(0.105, 0.105, 0.035, 20), materials.fixtureTrim, total);
  const core = new InstancedMesh(new CylinderGeometry(0.058, 0.058, 0.039, 16), materials.fixtureCore, total);
  const matrix = new Matrix4();
  const xPositions = rows === 1 ? [0] : [-width * 0.28, width * 0.28];

  xPositions.forEach((x, rowIndex) => {
    for (let index = 0; index < countZ; index += 1) {
      const z = -2.6 - index * (depth - 5.2) / Math.max(1, countZ - 1);
      const instance = rowIndex * countZ + index;
      matrix.makeTranslation(x, height - 0.08, z);
      trim.setMatrixAt(instance, matrix);
      matrix.makeTranslation(x, height - 0.102, z);
      core.setMatrixAt(instance, matrix);
    }
  });

  trim.instanceMatrix.needsUpdate = true;
  core.instanceMatrix.needsUpdate = true;
  root.name = "ceiling-downlights";
  root.add(trim, core);
  return root;
};
