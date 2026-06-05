import type { Vec3 } from "./GalleryItem";

export type JourneyMode = "scroll" | "manual";
export type BottomSheetState = "collapsed" | "half" | "full";

export interface CameraJourneyConfig {
  height?: number;
  fov?: number;
  startPosition?: Vec3;
  lookAhead?: number;
}

export interface JourneyConfig {
  mode: JourneyMode;
  loop?: boolean;
  smoothing?: number;
  damping?: number;
  loopWhiteAfterEndWindow?: number;
  loopWhiteStartsBeforeEndWindow?: number;
  loopWhiteFadeOutWindow?: number;
  loopWhiteFadeOutRevealWindow?: number;
  loopProgressAdvanceDuringWhiteFadeOut?: number;
  camera?: CameraJourneyConfig;
}

export interface CameraKeyframe {
  progress: number;
  position: Vec3;
  lookAt: Vec3;
  activeItemId: string | null;
  label: string;
}

export interface CameraState {
  position: Vec3;
  lookAt: Vec3;
  activeItemId: string | null;
}

export interface InteractionState {
  bottomSheet: BottomSheetState;
  visible: boolean;
  active: boolean;
}

export interface JourneyState {
  progress: number;
  activeItemId: string | null;
  camera: CameraState;
  interaction: InteractionState;
}

export interface JourneyMetrics {
  cameraHeight: number;
  focusDistance: number;
  lookAhead: number;
}
