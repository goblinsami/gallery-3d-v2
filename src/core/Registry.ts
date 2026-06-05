import type { LayoutStrategy } from "../types/Layout";
import type { ItemRenderer } from "../types/Renderer";

export class Registry<TEntry extends { readonly type: string }> {
  private readonly entries = new Map<string, TEntry>();

  register(entry: TEntry): void {
    if (this.entries.has(entry.type)) {
      throw new Error(`Duplicate registry entry: ${entry.type}`);
    }

    this.entries.set(entry.type, entry);
  }

  get(type: string): TEntry {
    const entry = this.entries.get(type);
    if (!entry) {
      throw new Error(`Missing registry entry: ${type}`);
    }

    return entry;
  }

  has(type: string): boolean {
    return this.entries.has(type);
  }

  values(): TEntry[] {
    return Array.from(this.entries.values());
  }
}

export type RendererRegistry = Registry<ItemRenderer>;
export type LayoutRegistry = Registry<LayoutStrategy>;

export const createRendererRegistry = (): RendererRegistry => new Registry<ItemRenderer>();
export const createLayoutRegistry = (): LayoutRegistry => new Registry<LayoutStrategy>();
