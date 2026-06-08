import type { GalleryItem } from "../types/GalleryItem";
export interface ItemProgressEntry {
    itemId: string;
    sourceItemId: string;
    index: number;
    progress: number;
}
export declare const buildItemProgressMap: (items: GalleryItem[]) => ItemProgressEntry[];
export declare const getItemProgress: (entries: ItemProgressEntry[], itemId: string) => number | null;
export declare const getSequentialActiveItemId: (entries: ItemProgressEntry[], progress: number) => string | null;
export declare const getAdjacentItemProgress: (entries: ItemProgressEntry[], activeItemId: string | null, direction: 1 | -1) => ItemProgressEntry | null;
//# sourceMappingURL=itemProgress.d.ts.map