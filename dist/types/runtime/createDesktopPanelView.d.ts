import type { RuntimeInstance } from "../types/Runtime";
export interface DesktopPanelView {
    element: HTMLElement;
    dispose(): void;
}
export declare const createDesktopPanelView: (runtime: RuntimeInstance) => DesktopPanelView;
//# sourceMappingURL=createDesktopPanelView.d.ts.map