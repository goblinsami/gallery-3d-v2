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
export declare const buildItemProgressMap: (items: GalleryItem[]) => ItemProgressEntry[];
export declare const getItemProgress: (entries: ItemProgressEntry[], itemId: string) => number | null;
export declare const getSequentialActiveItemId: (entries: ItemProgressEntry[], progress: number, activeItemLead?: number | ActiveItemLeadOptions) => string | null;
export declare const getAdjacentItemProgress: (entries: ItemProgressEntry[], activeItemId: string | null, direction: 1 | -1) => ItemProgressEntry | null;
export declare const getLoopResetProgress: (entries: ItemProgressEntry[]) => number;
//# sourceMappingURL=itemProgress.d.ts.map