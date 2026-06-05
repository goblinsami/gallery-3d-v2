import type { RuntimeInstance } from "../types/Runtime";
export interface BottomSheetView {
    element: HTMLElement;
    dispose(): void;
}
export declare const createBottomSheetView: (runtime: RuntimeInstance) => BottomSheetView;
//# sourceMappingURL=createBottomSheetView.d.ts.map