import type { GalleryItem } from "../types/GalleryItem";

export interface ItemProgressEntry {
  itemId: string;
  sourceItemId: string;
  index: number;
  progress: number;
}

export const buildItemProgressMap = (items: GalleryItem[]): ItemProgressEntry[] => {
  if (items.length === 0) {
    return [];
  }

  const step = 1 / Math.max(1, items.length);
  return items.map((item, index) => ({
    itemId: item.id,
    sourceItemId: item.id.split("__loop_")[0],
    index,
    progress: Math.min(1, index * step + step * 0.62),
  }));
};

export const getItemProgress = (
  entries: ItemProgressEntry[],
  itemId: string,
): number | null =>
  entries.find((entry) => entry.itemId === itemId || entry.sourceItemId === itemId)?.progress ?? null;

export const getSequentialActiveItemId = (
  entries: ItemProgressEntry[],
  progress: number,
): string | null => {
  if (entries.length === 0) {
    return null;
  }

  const clampedProgress = Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0));
  const index = Math.min(entries.length - 1, Math.floor(clampedProgress * entries.length));
  return entries[index].sourceItemId;
};

export const getAdjacentItemProgress = (
  entries: ItemProgressEntry[],
  activeItemId: string | null,
  direction: 1 | -1,
): ItemProgressEntry | null => {
  if (entries.length === 0) {
    return null;
  }

  const activeIndex = activeItemId
    ? entries.findIndex((entry) => entry.itemId === activeItemId)
    : -1;
  const fallbackIndex = direction > 0 ? 0 : entries.length - 1;
  const nextIndex = activeIndex >= 0 ? activeIndex + direction : fallbackIndex;

  if (nextIndex < 0 || nextIndex >= entries.length) {
    return null;
  }

  return entries[nextIndex];
};
