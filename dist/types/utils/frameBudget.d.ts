import type { QualityPreset } from "../types/Quality";
export interface FrameBudgetSample {
    frameTimeMs: number;
}
export interface FrameBudgetAssessment {
    averageFrameTimeMs: number;
    overBudget: boolean;
    suggestedPreset: QualityPreset | null;
}
export declare const getFrameBudgetMs: (targetFps: number) => number;
export declare const getLowerQualityPreset: (preset: QualityPreset) => QualityPreset | null;
export declare const assessFrameBudget: (samples: FrameBudgetSample[], currentPreset: QualityPreset, targetFps: number) => FrameBudgetAssessment;
//# sourceMappingURL=frameBudget.d.ts.map