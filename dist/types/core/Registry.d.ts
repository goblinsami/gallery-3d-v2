import type { LayoutStrategy } from "../types/Layout";
import type { ItemRenderer } from "../types/Renderer";
export declare class Registry<TEntry extends {
    readonly type: string;
}> {
    private readonly entries;
    register(entry: TEntry): void;
    get(type: string): TEntry;
    has(type: string): boolean;
    values(): TEntry[];
}
export type RendererRegistry = Registry<ItemRenderer>;
export type LayoutRegistry = Registry<LayoutStrategy>;
export declare const createRendererRegistry: () => RendererRegistry;
export declare const createLayoutRegistry: () => LayoutRegistry;
//# sourceMappingURL=Registry.d.ts.map