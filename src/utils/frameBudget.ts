import type { QualityPreset } from "../types/Quality";

export interface FrameBudgetSample {
  frameTimeMs: number;
}

export interface FrameBudgetAssessment {
  averageFrameTimeMs: number;
  overBudget: boolean;
  suggestedPreset: QualityPreset | null;
}

const PRESET_ORDER: QualityPreset[] = ["low", "medium", "high", "ultra"];

export const getFrameBudgetMs = (targetFps: number): number => 1000 / Math.max(1, targetFps);

export const getLowerQualityPreset = (preset: QualityPreset): QualityPreset | null => {
  const index = PRESET_ORDER.indexOf(preset);
  return index > 0 ? PRESET_ORDER[index - 1] : null;
};

export const assessFrameBudget = (
  samples: FrameBudgetSample[],
  currentPreset: QualityPreset,
  targetFps: number,
): FrameBudgetAssessment => {
  if (samples.length === 0) {
    return {
      averageFrameTimeMs: 0,
      overBudget: false,
      suggestedPreset: null,
    };
  }

  const averageFrameTimeMs =
    samples.reduce((total, sample) => total + sample.frameTimeMs, 0) / samples.length;
  const budget = getFrameBudgetMs(targetFps);
  const overBudget = averageFrameTimeMs > budget * 1.18;

  return {
    averageFrameTimeMs,
    overBudget,
    suggestedPreset: overBudget ? getLowerQualityPreset(currentPreset) : null,
  };
};
