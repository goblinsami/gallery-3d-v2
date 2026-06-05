import type { LayoutRegistry, RendererRegistry } from "../core/Registry";
import type { RuntimeInstance, RuntimeMountOptions } from "../types/Runtime";
export interface RuntimeManagerOptions {
    renderers: RendererRegistry;
    layouts: LayoutRegistry;
}
export declare class RuntimeManager {
    private readonly renderers;
    private readonly layouts;
    constructor(options: RuntimeManagerOptions);
    mount(options: RuntimeMountOptions): Promise<RuntimeInstance>;
}
//# sourceMappingURL=RuntimeManager.d.ts.map