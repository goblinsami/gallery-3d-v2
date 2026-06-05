import type { LayoutRegistry } from "../core/Registry";
import { createLayoutRegistry } from "../core/Registry";
import { CorridorLayout } from "./CorridorLayout";
import { GalleryRoomLayout } from "./GalleryRoomLayout";
import { InfiniteCorridorLayout } from "./InfiniteCorridorLayout";

export const createDefaultLayoutRegistry = (): LayoutRegistry => {
  const registry = createLayoutRegistry();
  registry.register(new CorridorLayout());
  registry.register(new InfiniteCorridorLayout());
  registry.register(new GalleryRoomLayout());
  return registry;
};
