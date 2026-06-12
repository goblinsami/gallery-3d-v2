import type { GalleryItem, PlacementSide } from "../types/GalleryItem";

export interface ItemProgressEntry {
  itemId: string;
  sourceItemId: string;
  index: number;
  progress: number;
  placementSide: PlacementSide;
}

export interface ActiveItemLeadOptions {
  stationLead?: number;
  wallLead?: number;
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
    placementSide: item.placement.side ?? "auto",
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
  activeItemLead: number | ActiveItemLeadOptions = 0,
): string | null => {
  if (entries.length === 0) {
    return null;
  }

  const safeProgress = Number.isFinite(progress) ? progress : 0;
  const clampedProgress = Math.min(1, Math.max(0, safeProgress));
  const scaledProgress = clampedProgress * entries.length;
  const index = Math.min(entries.length - 1, Math.floor(scaledProgress));
  const current = entries[index];
  const next = entries[index + 1];

  if (!current || !next) {
    return current?.sourceItemId ?? null;
  }

  const rawLead = typeof activeItemLead === "number"
    ? activeItemLead
    : next.placementSide === "center"
      ? activeItemLead.stationLead ?? 0
      : activeItemLead.wallLead ?? 0;
  const lead = Math.min(0.95, Math.max(0, Number.isFinite(rawLead) ? rawLead : 0));
  const segmentProgress = scaledProgress - index;

  return segmentProgress >= 1 - lead ? next.sourceItemId : current.sourceItemId;
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

export const getLoopResetProgress = (entries: ItemProgressEntry[]): number => {
  if (entries.length === 0) {
    return 1;
  }

  const step = 1 / Math.max(1, entries.length);
  const last = entries[entries.length - 1];
  const lastStart = (entries.length - 1) * step;
  const finalItemExitRatio = last.placementSide === "center" ? 0.72 : 0.86;

  return Math.min(1, lastStart + step * finalItemExitRatio);
};
