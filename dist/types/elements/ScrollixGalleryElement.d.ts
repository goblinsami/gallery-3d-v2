import type { GalleryProject } from "../types/GalleryProject";
export declare class ScrollixGalleryElement extends HTMLElement {
    static observedAttributes: string[];
    private readonly viewport;
    private readonly progressFill;
    private runtime;
    private bottomSheet;
    private desktopPanel;
    private unsubscribeState;
    private currentProject;
    private mountedAssetBaseUrl;
    private mountedAutoStartJourney;
    constructor();
    set project(project: GalleryProject | null);
    get project(): GalleryProject | null;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string): void;
    private syncRuntime;
    private parseProjectAttribute;
    private getAssetBaseUrl;
    private getAutoStartJourney;
    private getInitialProgress;
    private applyRuntimeState;
    private disposeRuntime;
    private handleKeydown;
    private handleViewportClick;
}
export declare const defineScrollixGalleryElement: (tagName?: string) => void;
export declare const registerScrollixGalleryRuntime: (tagName?: string) => void;
declare global {
    interface Window {
        ScrollixGalleryRuntime?: {
            init(tagName?: string): void;
            registerWebComponents(tagName?: string): void;
        };
    }
    interface HTMLElementTagNameMap {
        "scrollix-gallery": ScrollixGalleryElement;
    }
}
//# sourceMappingURL=ScrollixGalleryElement.d.ts.map