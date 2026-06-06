export interface TextureFamilyConfig {
  label: string;
  colorUrl: string;
  normalUrl: string;
  tint: string;
  accent: string;
  emissive: string;
  normalScale: number;
  wallRepeatScale: number;
  floorRepeatScale: number;
  ceilingRepeatScale: number;
}

export const TEXTURE_LIBRARY = {
  stone: {
    label: "Legacy stone",
    colorUrl: "/textures/stone/stone_color.jpg",
    normalUrl: "/textures/stone/stone_normal.jpg",
    tint: "#ffffff",
    accent: "#6d5b43",
    emissive: "#2a2118",
    normalScale: 0.72,
    wallRepeatScale: 1.35,
    floorRepeatScale: 1.3,
    ceilingRepeatScale: 1.1,
  },
  brick: {
    label: "Brick",
    colorUrl: "/textures/brick/brick_color.jpg",
    normalUrl: "/textures/brick/brick_normal.jpg",
    tint: "#fff4df",
    accent: "#8b5a38",
    emissive: "#332016",
    normalScale: 0.88,
    wallRepeatScale: 1.9,
    floorRepeatScale: 2.2,
    ceilingRepeatScale: 1.55,
  },
  wood: {
    label: "Wood",
    colorUrl: "/textures/wood/wood_color.jpg",
    normalUrl: "/textures/wood/wood_normal.jpg",
    tint: "#fff3dc",
    accent: "#765239",
    emissive: "#302014",
    normalScale: 0.62,
    wallRepeatScale: 1.55,
    floorRepeatScale: 1.45,
    ceilingRepeatScale: 1.2,
  },
} satisfies Record<string, TextureFamilyConfig>;

export type TexturedMaterialFamily = keyof typeof TEXTURE_LIBRARY;
export type UntypedMaterialFamily = "concrete" | "metal" | "glass";
export type MaterialFamily = TexturedMaterialFamily | UntypedMaterialFamily;

export const TEXTURE_FAMILY_VALUES = Object.keys(TEXTURE_LIBRARY) as TexturedMaterialFamily[];
export const MATERIAL_FAMILY_VALUES: MaterialFamily[] = [
  ...TEXTURE_FAMILY_VALUES,
  "concrete",
  "metal",
  "glass",
];

export interface TextureFamilyOption {
  value: TexturedMaterialFamily;
  label: string;
}

export const TEXTURE_FAMILY_OPTIONS: TextureFamilyOption[] = (
  TEXTURE_FAMILY_VALUES
).map((value) => ({
  value,
  label: TEXTURE_LIBRARY[value].label,
}));

export const isTexturedMaterialFamily = (
  materialFamily: MaterialFamily,
): materialFamily is TexturedMaterialFamily =>
  Object.hasOwn(TEXTURE_LIBRARY, materialFamily);

export const resolveTextureFamily = (materialFamily: MaterialFamily): TexturedMaterialFamily =>
  isTexturedMaterialFamily(materialFamily) ? materialFamily : "stone";
