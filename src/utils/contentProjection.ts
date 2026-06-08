import type {
  GalleryAction,
  GalleryContentLink,
  GalleryContentProjection,
  GalleryContentSection,
  GalleryItem,
  MediaReference,
} from "../types/GalleryItem";

const getString = (content: Record<string, unknown>, key: string): string | undefined => {
  const value = content[key];
  return clean(value);
};

const clean = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }

  const lowered = trimmed.toLowerCase();
  return lowered === "undefined" || lowered === "null" ? undefined : trimmed;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const toTitleCase = (value: string): string =>
  value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getStringList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(clean).filter((entry): entry is string => Boolean(entry));
  }

  const single = clean(value);
  return single ? [single] : [];
};

const getMetadata = (content: Record<string, unknown>): Record<string, string | string[]> | undefined => {
  const value = content.metadata;
  if (!isRecord(value)) {
    return undefined;
  }

  const entries = Object.entries(value).flatMap(([key, entry]) => {
    const list = getStringList(entry);
    if (list.length === 0) {
      return [];
    }

    return [[key, Array.isArray(entry) ? list : list[0]] as const];
  });

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
};

const getFirstImage = (
  content: Record<string, unknown>,
  media: MediaReference[] | undefined,
): string | undefined => {
  const explicit = clean(content.thumbnailUrl) ?? clean(content.image) ?? clean(content.imageUrl);
  if (explicit) {
    return explicit;
  }

  return media?.find((entry) => entry.type === "image" || !entry.type)?.src;
};

const getLinks = (source: unknown): GalleryContentLink[] => {
  if (!Array.isArray(source)) {
    return [];
  }

  return source
    .map((entry) => {
      if (!isRecord(entry)) {
        return null;
      }

      const label = clean(entry.label);
      const url = clean(entry.url) ?? clean(entry.href);
      if (!label || !url) {
        return null;
      }

      const icon = clean(entry.icon);
      return icon ? { label, url, icon } : { label, url };
    })
    .filter((entry): entry is GalleryContentLink => entry !== null);
};

const getActions = (source: unknown): GalleryAction[] | undefined => {
  if (!Array.isArray(source)) {
    return undefined;
  }

  const actions = source
    .map((entry): GalleryAction | null => {
      if (!isRecord(entry)) {
        return null;
      }

      const label = clean(entry.label);
      const href = clean(entry.href) ?? clean(entry.url);
      if (!label) {
        return null;
      }

      return href ? { label, href, url: href } : { label };
    })
    .filter((entry): entry is GalleryAction => entry !== null);
  return actions.length > 0 ? actions : undefined;
};

const getCta = (content: Record<string, unknown>, actions: GalleryAction[] | undefined): GalleryAction | undefined => {
  const cta = content.cta;
  if (isRecord(cta)) {
    const label = clean(cta.label);
    const href = clean(cta.href) ?? clean(cta.url);
    if (label && href) {
      return { label, href, url: href };
    }
  }

  return actions?.find((action) => action.intent === "primary" || action.href || action.url);
};

const pushSection = (
  sections: GalleryContentSection[],
  id: string,
  title: string,
  lines: Array<string | undefined>,
): void => {
  const cleanLines = lines.map(clean).filter((entry): entry is string => Boolean(entry));
  if (cleanLines.length === 0) {
    return;
  }

  sections.push({ id, title, lines: cleanLines });
};

const getCustomSections = (source: unknown): GalleryContentSection[] => {
  if (!Array.isArray(source)) {
    return [];
  }

  return source
    .map((entry, index) => {
      if (!isRecord(entry)) {
        return null;
      }

      const title = clean(entry.title);
      const lines = getStringList(entry.lines ?? entry.items ?? entry.body);
      if (!title || lines.length === 0) {
        return null;
      }

      return {
        id: clean(entry.id) ?? `section-${index + 1}`,
        title,
        lines,
      };
    })
    .filter((entry): entry is GalleryContentSection => entry !== null);
};

const buildSections = (
  content: Record<string, unknown>,
  metadata: Record<string, string | string[]> | undefined,
  description: string | undefined,
): GalleryContentSection[] => {
  const sections: GalleryContentSection[] = [];
  const category = metadata?.category ?? metadata?.medium;
  const details = [
    metadata?.artist ? `Artist: ${metadata.artist}` : undefined,
    typeof category === "string" ? `Category: ${category}` : undefined,
    metadata?.year ? `Year: ${metadata.year}` : undefined,
  ];

  Object.entries(metadata ?? {}).forEach(([key, value]) => {
    if (["artist", "category", "medium", "year", "tags"].includes(key)) {
      return;
    }

    if (typeof value === "string") {
      details.push(`${toTitleCase(key)}: ${value}`);
    }
  });
  pushSection(sections, "details", "Details", details);

  const tags = [
    ...getStringList(metadata?.tags),
    ...getStringList(content.tags),
  ];
  pushSection(sections, "tags", "Tags", tags);

  const biography = getString(content, "biography");
  const manifesto = getString(content, "manifesto");
  if (biography && biography !== description) {
    pushSection(sections, "biography", "Biography", [biography]);
  }

  if (manifesto && manifesto !== description) {
    pushSection(sections, "manifesto", "Manifesto", [manifesto]);
  }

  pushSection(sections, "services", "Services", getStringList(content.services));
  pushSection(sections, "testimonials", "Testimonials", getStringList(content.testimonials));
  pushSection(sections, "references", "References", getStringList(content.references));

  const contact = content.contact;
  if (isRecord(contact)) {
    pushSection(sections, "contact", "Contact", [
      clean(contact.email),
      clean(contact.phone),
      clean(contact.location),
    ]);
  }

  return [...sections, ...getCustomSections(content.sections)];
};

export const projectItemContent = (
  item: GalleryItem,
  index?: number,
  total?: number,
): GalleryContentProjection => {
  const media = item.appearance.media;
  const metadata = getMetadata(item.content);
  const actions = getActions(item.content.actions);
  const description = getString(item.content, "description") ?? getString(item.content, "body");
  const progressLabel = typeof index === "number" && typeof total === "number" && total > 0
    ? `${Math.max(0, index) + 1} / ${total}`
    : undefined;

  return {
    eyebrow: getString(item.content, "eyebrow") ?? item.type,
    title: getString(item.content, "title") ?? item.id,
    subtitle: getString(item.content, "subtitle"),
    description,
    body: getString(item.content, "body"),
    metadata,
    actions,
    media,
    thumbnailUrl: getFirstImage(item.content, media),
    sections: buildSections(item.content, metadata, description),
    socialLinks: getLinks(item.content.socialLinks),
    cta: getCta(item.content, actions),
    progressLabel,
  };
};
