import { MeshBasicMaterial, MeshStandardMaterial } from "three";
import type { QualitySettings } from "../types/Quality";
import type { MaterialFamily, TextureTilingConfig } from "../types/GalleryProject";
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
export declare const createProceduralArchitecturalMaterials: (quality: QualitySettings, depth: number, materialFamily: MaterialFamily, ceilingLightIntensity?: number, textureCycleDepth?: number, assetBaseUrl?: string, textureTiling?: TextureTilingConfig, surfaceSize?: ArchitecturalMaterialSurfaceSize) => Promise<ProceduralArchitecturalMaterials>;
//# sourceMappingURL=createProceduralArchitecturalMaterials.d.ts.map