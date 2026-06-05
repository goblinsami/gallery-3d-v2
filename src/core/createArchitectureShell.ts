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
import { createArchitecturalDetailLayer } from "./createArchitecturalDetailLayer";
import type { ProceduralArchitecturalMaterials } from "./createProceduralArchitecturalMaterials";
import { createProceduralArchitecturalMaterials } from "./createProceduralArchitecturalMaterials";

export const createArchitectureShell = (
  layout: LayoutConfig,
  quality: QualitySettings,
): Promise<Group> => {
  const root = new Group();
  const width = layout.bounds?.width ?? 5.4;
  const height = layout.bounds?.height ?? 3.4;
  const depth = Math.max(layout.bounds?.depth ?? 44, 20);
  return createProceduralArchitecturalMaterials(quality, depth).then((materials) => {
  const floor = new Mesh(new BoxGeometry(width, 0.05, depth), materials.floor);
  const ceiling = new Mesh(new PlaneGeometry(width, depth), materials.ceiling);
  const leftWall = new Mesh(new PlaneGeometry(depth, height), materials.wall);
  const rightWall = new Mesh(new PlaneGeometry(depth, height), materials.wall);
  const leftPlinth = new Mesh(new BoxGeometry(0.08, 0.9, depth), materials.floor);
  const rightPlinth = new Mesh(new BoxGeometry(0.08, 0.9, depth), materials.floor);
  const ambient = new AmbientLight("#f4ead9", quality.preset === "low" ? 0.32 : 0.46);
  const hemisphere = new HemisphereLight("#fff4dc", "#5b452d", quality.preset === "low" ? 0.58 : 0.82);
  const key = new DirectionalLight("#fff2d7", quality.lightBudget > 1 ? 1.24 : 0.78);

  floor.position.set(0, -0.025, -depth / 2);
  ceiling.position.set(0, height, -depth / 2);
  ceiling.rotation.x = Math.PI / 2;
  leftWall.position.set(-width / 2, height / 2, -depth / 2);
  leftWall.rotation.y = Math.PI / 2;
  rightWall.position.set(width / 2, height / 2, -depth / 2);
  rightWall.rotation.y = -Math.PI / 2;
  leftPlinth.position.set(-width / 2 + 0.06, 0.45, -depth / 2);
  rightPlinth.position.set(width / 2 - 0.06, 0.45, -depth / 2);
  key.position.set(-1.8, height - 0.45, 2.8);
  floor.receiveShadow = true;
  ceiling.receiveShadow = true;
  leftWall.receiveShadow = true;
  rightWall.receiveShadow = true;

  root.name = "architecture-shell";
  root.add(floor, ceiling, leftWall, rightWall, leftPlinth, rightPlinth, ambient, hemisphere, key);
  root.add(createArchitecturalDetailLayer(width, depth, height, materials, quality));
  root.add(createLongLeds(width, depth, height, materials));
  root.add(createStructuralRibs(width, depth, height, materials, quality));
  root.add(createCeilingGrid(width, depth, height, materials, quality));
  root.add(createCeilingDownlights(width, depth, height, materials, quality));
  root.add(createArchitecturalBake(width, depth, height, quality));

  return root;
  });
};

const createCeilingGrid = (
  width: number,
  depth: number,
  height: number,
  materials: ProceduralArchitecturalMaterials,
  quality: QualitySettings,
): Group => {
  const root = new Group();
  const railWidth = 0.035;
  const zSpacing = quality.geometryDetail > 0.75 ? 4.2 : 5.6;
  const crossCount = Math.max(7, Math.floor(depth / zSpacing));
  const longitudinalXs = [-width * 0.42, 0, width * 0.42];
  const matrix = new Matrix4();
  const crossRails = new InstancedMesh(new BoxGeometry(width, railWidth, railWidth), materials.trim, crossCount);
  const longitudinalRails = new InstancedMesh(
    new BoxGeometry(railWidth, railWidth, depth),
    materials.trim,
    longitudinalXs.length,
  );

  for (let index = 0; index < crossCount; index += 1) {
    const z = -1.4 - index * ((depth - 2.8) / Math.max(1, crossCount - 1));
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
  const horizontal = new BoxGeometry(0.035, 0.035, depth);
  const vertical = new BoxGeometry(0.035, height - 0.3, 0.035);
  const positions = [
    [-width / 2 + 0.08, height - 0.18, -depth / 2],
    [width / 2 - 0.08, height - 0.18, -depth / 2],
    [-width / 2 + 0.08, 0.88, -depth / 2],
    [width / 2 - 0.08, 0.88, -depth / 2],
  ] as const;

  positions.forEach(([x, y, z], index) => {
    const led = new Mesh(horizontal, materials.led);
    led.position.set(x, y, z);
    led.name = `corridor-long-led-${index}`;
    root.add(led);
  });

  const portalLeft = new Mesh(vertical, materials.led);
  const portalRight = new Mesh(vertical, materials.led);
  portalLeft.position.set(-width / 2 + 0.08, height / 2, -0.04);
  portalRight.position.set(width / 2 - 0.08, height / 2, -0.04);
  root.add(portalLeft, portalRight);
  root.name = "corridor-long-leds";
  return root;
};

const createStructuralRibs = (
  width: number,
  depth: number,
  height: number,
  materials: ProceduralArchitecturalMaterials,
  quality: QualitySettings,
): Group => {
  const root = new Group();
  const count = Math.max(5, Math.round((quality.geometryDetail > 0.75 ? 9 : 6) * (depth / 52)));
  const matrix = new Matrix4();
  const ceilingRibs = new InstancedMesh(new BoxGeometry(width, 0.05, 0.045), materials.trim, count);
  const wallRibs = new InstancedMesh(new BoxGeometry(0.07, height, 0.045), materials.trim, count * 2);
  const verticalLeds = new InstancedMesh(new BoxGeometry(0.028, height - 0.45, 0.028), materials.led, count * 2);

  for (let index = 0; index < count; index += 1) {
    const z = -depth * (index / Math.max(1, count - 1));
    matrix.makeTranslation(0, height - 0.08, z);
    ceilingRibs.setMatrixAt(index, matrix);
    matrix.makeTranslation(-width / 2 + 0.08, height / 2, z);
    wallRibs.setMatrixAt(index * 2, matrix);
    verticalLeds.setMatrixAt(index * 2, matrix);
    matrix.makeTranslation(width / 2 - 0.08, height / 2, z);
    wallRibs.setMatrixAt(index * 2 + 1, matrix);
    verticalLeds.setMatrixAt(index * 2 + 1, matrix);
  }

  ceilingRibs.instanceMatrix.needsUpdate = true;
  wallRibs.instanceMatrix.needsUpdate = true;
  verticalLeds.instanceMatrix.needsUpdate = true;
  root.name = "corridor-structural-ribs";
  root.add(ceilingRibs, wallRibs, verticalLeds);
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
