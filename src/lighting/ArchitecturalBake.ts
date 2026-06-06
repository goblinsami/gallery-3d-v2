import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  DoubleSide,
  Euler,
  Group,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  PlaneGeometry,
  Quaternion,
  Vector3,
} from "three";
import type { QualitySettings } from "../types/Quality";
import {
  getArchitecturalModuleCount,
  getArchitecturalModuleSegmentDepth,
  getArchitecturalModuleZ,
} from "../utils/architecturalModules";

type GradientAxis = "x" | "y";
type GradientFocus = "start" | "center" | "end";

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

const createRgba = (colorValue: string, alpha: number): string => {
  const color = new Color(colorValue);
  return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${alpha})`;
};

const addGradientStops = (
  gradient: CanvasGradient,
  focus: GradientFocus,
  colorValue: string,
): void => {
  if (focus === "start") {
    gradient.addColorStop(0, createRgba(colorValue, 1));
    gradient.addColorStop(0.28, createRgba(colorValue, 0.5));
    gradient.addColorStop(1, createRgba(colorValue, 0));
    return;
  }

  if (focus === "end") {
    gradient.addColorStop(0, createRgba(colorValue, 0));
    gradient.addColorStop(0.72, createRgba(colorValue, 0.5));
    gradient.addColorStop(1, createRgba(colorValue, 1));
    return;
  }

  gradient.addColorStop(0, createRgba(colorValue, 0));
  gradient.addColorStop(0.36, createRgba(colorValue, 0.28));
  gradient.addColorStop(0.5, createRgba(colorValue, 1));
  gradient.addColorStop(0.64, createRgba(colorValue, 0.28));
  gradient.addColorStop(1, createRgba(colorValue, 0));
};

const createGradientTexture = (
  axis: GradientAxis,
  focus: GradientFocus,
  colorValue: string,
): CanvasTexture => {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");

  if (context) {
    const gradient = axis === "x"
      ? context.createLinearGradient(0, 0, canvas.width, 0)
      : context.createLinearGradient(0, 0, 0, canvas.height);
    addGradientStops(gradient, focus, colorValue);
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const createBakeMaterial = (
  axis: GradientAxis,
  focus: GradientFocus,
  opacity: number,
): MeshBasicMaterial => {
  const color = "#fff0c6";
  return new MeshBasicMaterial({
    color,
    map: createGradientTexture(axis, focus, color),
    transparent: true,
    opacity,
    blending: AdditiveBlending,
    depthWrite: false,
    side: DoubleSide,
    toneMapped: false,
  });
};

const createTransform = (
  x: number,
  y: number,
  z: number,
  rotationX = 0,
  rotationY = 0,
): Matrix4 =>
  new Matrix4().compose(
    new Vector3(x, y, z),
    new Quaternion().setFromEuler(new Euler(rotationX, rotationY, 0)),
    new Vector3(1, 1, 1),
  );

export const createArchitecturalBake = (
  width: number,
  depth: number,
  height: number,
  quality: QualitySettings,
  ceilingLightIntensity = 1,
): Group => {
  const root = new Group();
  const count = getArchitecturalModuleCount(depth, quality.geometryDetail);
  const segmentDepth = getArchitecturalModuleSegmentDepth(depth, count);
  const surfaceOffset = 0.018;
  const wallX = width / 2 - surfaceOffset;
  const floorGlowWidth = Math.min(1.42, width / 2);
  const wallEdgeHeight = Math.min(0.74, height / 2);
  const verticalGlowWidth = 0.95;
  const baseOpacity = quality.preset === "low" ? 0.18 : 0.32;
  const ceilingOpacity = baseOpacity * 0.68 * Math.max(0, ceilingLightIntensity);
  const verticalGlowBottom = 0;
  const verticalGlowTop = height;
  const verticalGlowHeight = verticalGlowTop - verticalGlowBottom;
  const verticalGlowCenter = verticalGlowBottom + verticalGlowHeight / 2;

  const floorLeft = new InstancedMesh(
    new PlaneGeometry(floorGlowWidth, segmentDepth),
    createBakeMaterial("x", "start", baseOpacity),
    count,
  );
  const floorRight = new InstancedMesh(
    new PlaneGeometry(floorGlowWidth, segmentDepth),
    createBakeMaterial("x", "end", baseOpacity),
    count,
  );
  const ceilingLeft = new InstancedMesh(
    new PlaneGeometry(floorGlowWidth, segmentDepth),
    createBakeMaterial("x", "start", ceilingOpacity),
    count,
  );
  const ceilingRight = new InstancedMesh(
    new PlaneGeometry(floorGlowWidth, segmentDepth),
    createBakeMaterial("x", "end", ceilingOpacity),
    count,
  );
  const wallLower = new InstancedMesh(
    new PlaneGeometry(segmentDepth, wallEdgeHeight),
    createBakeMaterial("y", "start", baseOpacity * 0.62),
    count * 2,
  );
  const wallUpper = new InstancedMesh(
    new PlaneGeometry(segmentDepth, wallEdgeHeight),
    createBakeMaterial("y", "end", baseOpacity * 0.52),
    count * 2,
  );
  const wallVertical = new InstancedMesh(
    new PlaneGeometry(verticalGlowWidth, verticalGlowHeight),
    createBakeMaterial("x", "center", baseOpacity * 0.96),
    count * 2,
  );

  for (let index = 0; index < count; index += 1) {
    const z = getArchitecturalModuleZ(depth, count, index);
    const zCenter = z - segmentDepth * 0.5;

    floorLeft.setMatrixAt(
      index,
      createTransform(-wallX + floorGlowWidth / 2, surfaceOffset, zCenter, -Math.PI / 2),
    );
    floorRight.setMatrixAt(
      index,
      createTransform(wallX - floorGlowWidth / 2, surfaceOffset, zCenter, -Math.PI / 2),
    );
    ceilingLeft.setMatrixAt(
      index,
      createTransform(-wallX + floorGlowWidth / 2, height - surfaceOffset, zCenter, Math.PI / 2),
    );
    ceilingRight.setMatrixAt(
      index,
      createTransform(wallX - floorGlowWidth / 2, height - surfaceOffset, zCenter, Math.PI / 2),
    );
    wallLower.setMatrixAt(
      index * 2,
      createTransform(-wallX, wallEdgeHeight / 2, zCenter, 0, Math.PI / 2),
    );
    wallLower.setMatrixAt(
      index * 2 + 1,
      createTransform(wallX, wallEdgeHeight / 2, zCenter, 0, -Math.PI / 2),
    );
    wallUpper.setMatrixAt(
      index * 2,
      createTransform(-wallX, height - wallEdgeHeight / 2, zCenter, 0, Math.PI / 2),
    );
    wallUpper.setMatrixAt(
      index * 2 + 1,
      createTransform(wallX, height - wallEdgeHeight / 2, zCenter, 0, -Math.PI / 2),
    );
    wallVertical.setMatrixAt(index * 2, createTransform(-wallX, verticalGlowCenter, z, 0, Math.PI / 2));
    wallVertical.setMatrixAt(index * 2 + 1, createTransform(wallX, verticalGlowCenter, z, 0, -Math.PI / 2));
  }

  [floorLeft, floorRight, ceilingLeft, ceilingRight, wallLower, wallUpper, wallVertical].forEach((mesh) => {
    mesh.instanceMatrix.needsUpdate = true;
  });
  floorLeft.name = "led-bake-floor-left";
  floorRight.name = "led-bake-floor-right";
  ceilingLeft.name = "led-bake-ceiling-left";
  ceilingRight.name = "led-bake-ceiling-right";
  wallLower.name = "led-bake-wall-lower";
  wallUpper.name = "led-bake-wall-upper";
  wallVertical.name = "led-bake-wall-vertical";
  root.name = "architectural-bake-root";
  root.add(floorLeft, floorRight, ceilingLeft, ceilingRight, wallLower, wallUpper, wallVertical);
  return root;
};
