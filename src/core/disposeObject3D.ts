import type { Material, Object3D, Texture } from "three";

interface DisposableGeometry {
  dispose(): void;
}

interface ObjectWithGeometry extends Object3D {
  geometry?: DisposableGeometry;
  material?: Material | Material[];
}

const disposeTexture = (value: unknown): void => {
  if (value && typeof value === "object" && "isTexture" in value && "dispose" in value) {
    (value as Texture).dispose();
  }
};

const disposeMaterial = (material: Material): void => {
  Object.values(material).forEach(disposeTexture);
  material.dispose();
};

export const disposeObject3D = (root: Object3D): void => {
  const disposedGeometries = new Set<DisposableGeometry>();
  const disposedMaterials = new Set<Material>();

  root.traverse((object) => {
    const candidate = object as ObjectWithGeometry;
    if (candidate.geometry && !disposedGeometries.has(candidate.geometry)) {
      candidate.geometry.dispose();
      disposedGeometries.add(candidate.geometry);
    }

    if (Array.isArray(candidate.material)) {
      candidate.material.forEach((material) => {
        if (!disposedMaterials.has(material)) {
          disposeMaterial(material);
          disposedMaterials.add(material);
        }
      });
      return;
    }

    if (candidate.material && !disposedMaterials.has(candidate.material)) {
      disposeMaterial(candidate.material);
      disposedMaterials.add(candidate.material);
    }
  });
};
