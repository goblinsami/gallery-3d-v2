import type { GalleryProject } from "../types/GalleryProject";

export const getLoopCycleDepth = (project: GalleryProject): number => {
  const spacing = project.layout.spacing ?? 7;
  const hasExplicitSlots = project.items.some((item) => typeof item.placement.slot === "number");
  const maxSlot = project.items.reduce(
    (max, item, index) => Math.max(max, item.placement.slot ?? index + 1),
    project.items.length,
  );

  return (hasExplicitSlots ? maxSlot + 2 : maxSlot) * spacing;
};
