import { MeshBasicMaterial, MeshStandardMaterial } from "three";
import type { QualitySettings } from "../types/Quality";
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
export declare const createProceduralArchitecturalMaterials: (quality: QualitySettings, depth: number) => Promise<ProceduralArchitecturalMaterials>;
//# sourceMappingURL=createProceduralArchitecturalMaterials.d.ts.map