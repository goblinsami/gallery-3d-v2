import { BoxGeometry, Group, InstancedMesh, Matrix4, PlaneGeometry } from "three";
import type { QualitySettings } from "../types/Quality";
import type { ProceduralArchitecturalMaterials } from "./createProceduralArchitecturalMaterials";

export const createArchitecturalDetailLayer = (
  width: number,
  depth: number,
  height: number,
  materials: ProceduralArchitecturalMaterials,
  quality: QualitySettings,
): Group => {
  const root = new Group();
  root.name = "architectural-detail-layer";
  root.add(createWallPanels(width, depth, height, materials, quality));
  root.add(createCeilingPanels(width, depth, height, materials, quality));
  return root;
};

const createWallPanels = (
  width: number,
  depth: number,
  height: number,
  materials: ProceduralArchitecturalMaterials,
  quality: QualitySettings,
): Group => {
  const root = new Group();
  const count = Math.max(7, Math.round((quality.geometryDetail > 0.75 ? 12 : 8) * (depth / 72)));
  const panelDepth = depth / count * 0.78;
  const upperGeometry = new PlaneGeometry(panelDepth, height * 0.56);
  const lowerGeometry = new PlaneGeometry(panelDepth, 0.42);
  const upperLeft = new InstancedMesh(upperGeometry, materials.wallAccent, count);
  const upperRight = new InstancedMesh(upperGeometry, materials.wallAccent, count);
  const lowerLeft = new InstancedMesh(lowerGeometry, materials.floorAccent, count);
  const lowerRight = new InstancedMesh(lowerGeometry, materials.floorAccent, count);
  const matrix = new Matrix4();

  for (let index = 0; index < count; index += 1) {
    const z = -panelDepth * 0.5 - index * (depth / count);
    matrix.makeRotationY(Math.PI / 2);
    matrix.setPosition(-width / 2 + 0.072, height * 0.58, z);
    upperLeft.setMatrixAt(index, matrix);
    matrix.makeRotationY(-Math.PI / 2);
    matrix.setPosition(width / 2 - 0.072, height * 0.58, z);
    upperRight.setMatrixAt(index, matrix);
    matrix.makeRotationY(Math.PI / 2);
    matrix.setPosition(-width / 2 + 0.078, 0.38, z);
    lowerLeft.setMatrixAt(index, matrix);
    matrix.makeRotationY(-Math.PI / 2);
    matrix.setPosition(width / 2 - 0.078, 0.38, z);
    lowerRight.setMatrixAt(index, matrix);
  }

  upperLeft.instanceMatrix.needsUpdate = true;
  upperRight.instanceMatrix.needsUpdate = true;
  lowerLeft.instanceMatrix.needsUpdate = true;
  lowerRight.instanceMatrix.needsUpdate = true;
  root.name = "wall-panel-fields";
  root.add(upperLeft, upperRight, lowerLeft, lowerRight);
  return root;
};

const createCeilingPanels = (
  width: number,
  depth: number,
  height: number,
  materials: ProceduralArchitecturalMaterials,
  quality: QualitySettings,
): Group => {
  const root = new Group();
  const count = Math.max(8, Math.round((quality.geometryDetail > 0.75 ? 14 : 9) * (depth / 72)));
  const panelDepth = depth / count * 0.72;
  const panels = new InstancedMesh(
    new BoxGeometry(width - 0.7, 0.025, panelDepth),
    materials.ceilingAccent,
    count,
  );
  const matrix = new Matrix4();

  for (let index = 0; index < count; index += 1) {
    matrix.makeTranslation(0, height - 0.052, -panelDepth * 0.5 - index * (depth / count));
    panels.setMatrixAt(index, matrix);
  }

  panels.instanceMatrix.needsUpdate = true;
  root.name = "ceiling-panel-fields";
  root.add(panels);
  return root;
};
