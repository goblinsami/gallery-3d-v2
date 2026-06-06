import { Group } from "three";
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
export declare const planArchitecturalBake: (config: ArchitecturalBakeConfig, quality: QualitySettings) => ArchitecturalBakePlan;
export declare const createArchitecturalBake: (width: number, depth: number, height: number, quality: QualitySettings, ceilingLightIntensity?: number) => Group;
//# sourceMappingURL=ArchitecturalBake.d.ts.map