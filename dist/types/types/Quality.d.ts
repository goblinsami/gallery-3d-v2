export type QualityPreset = "low" | "medium" | "high" | "ultra";
export interface QualitySettings {
    preset: QualityPreset;
    pixelRatioCap: number;
    textureScale: number;
    lightBudget: number;
    shadows: boolean;
    geometryDetail: number;
}
export interface DeviceProfile {
    mobile: boolean;
    reducedMotion: boolean;
    devicePixelRatio: number;
    viewportWidth: number;
    viewportHeight: number;
}
//# sourceMappingURL=Quality.d.ts.map