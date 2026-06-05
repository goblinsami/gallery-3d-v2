import type { GalleryContentProjection, GalleryItem } from "../types/GalleryItem";

const getString = (content: Record<string, unknown>, key: string): string | undefined => {
  const value = content[key];
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
};

const getMetadata = (content: Record<string, unknown>): Record<string, string> | undefined => {
  const value = content.metadata;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const entries = Object.entries(value).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string",
  );

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
};

export const projectItemContent = (item: GalleryItem): GalleryContentProjection => ({
  eyebrow: getString(item.content, "eyebrow"),
  title: getString(item.content, "title") ?? item.id,
  subtitle: getString(item.content, "subtitle"),
  description: getString(item.content, "description"),
  body: getString(item.content, "body"),
  metadata: getMetadata(item.content),
});
