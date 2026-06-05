import {
  AdditiveBlending,
  DoubleSide,
  Group,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  PlaneGeometry,
  Quaternion,
  Vector3,
} from "three";
import type { QualitySettings } from "../types/Quality";

export interface ArchitecturalBakeConfig {
  enabled: boolean;
  intensity: number;
}

export interface ArchitecturalBakePlan {
  ledStripCount: number;
  glowPlaneCount: number;
  dynamicLightCount: number;
}

export const planArchitecturalBake = (
  config: ArchitecturalBakeConfig,
  quality: QualitySettings,
): ArchitecturalBakePlan => ({
  ledStripCount: config.enabled ? Math.max(2, Math.round(12 * quality.geometryDetail)) : 0,
  glowPlaneCount: config.enabled ? Math.max(2, Math.round(24 * quality.geometryDetail)) : 0,
  dynamicLightCount: config.enabled ? Math.min(quality.lightBudget, 4) : 0,
});

export const createArchitecturalBake = (
  width: number,
  depth: number,
  height: number,
  quality: QualitySettings,
): Group => {
  const root = new Group();
  const plan = planArchitecturalBake({ enabled: true, intensity: 1 }, quality);
  const count = Math.max(2, plan.glowPlaneCount);
  const geometry = new PlaneGeometry(0.42, Math.max(1.2, depth / count));
  const material = new MeshBasicMaterial({
    color: "#fff2c4",
    transparent: true,
    opacity: quality.preset === "low" ? 0.08 : 0.14,
    blending: AdditiveBlending,
    depthWrite: false,
    side: DoubleSide,
    toneMapped: false,
  });
  const mesh = new InstancedMesh(geometry, material, count * 2);
  const matrix = new Matrix4();
  const quaternion = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
  const scale = new Vector3(1, 1, 1);

  for (let index = 0; index < count; index += 1) {
    const z = -depth * (index / Math.max(1, count - 1));
    const left = new Vector3(-width / 2 + 0.36, 0.035, z);
    const right = new Vector3(width / 2 - 0.36, 0.035, z);
    matrix.compose(left, quaternion, scale);
    mesh.setMatrixAt(index * 2, matrix);
    matrix.compose(right, quaternion, scale);
    mesh.setMatrixAt(index * 2 + 1, matrix);
  }

  mesh.instanceMatrix.needsUpdate = true;
  mesh.name = "architectural-led-bake";
  root.name = "architectural-bake-root";
  root.add(mesh);

  void height;
  return root;
};
