import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const texturesDir = path.join(rootDir, "public", "textures");
const catalogPath = path.join(rootDir, "src", "config", "architecturalTextureCatalog.ts");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const isImage = (fileName) => imageExtensions.has(path.extname(fileName).toLowerCase());
const toCatalogKey = (folderName) =>
  folderName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());

const toLabel = (folderName) =>
  folderName
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeUrl = (folderName, fileName) =>
  `/textures/${folderName}/${fileName}`.replace(/\\/g, "/");

const pickTextureFile = (files, patterns, fallback) => {
  const imageFiles = files.filter(isImage);
  return imageFiles.find((file) => patterns.some((pattern) => pattern.test(file))) ??
    (fallback ? imageFiles.find(fallback) : undefined);
};

const colorPatterns = [
  /(^|[_\-. ])color([_\-. ]|$)/i,
  /albedo/i,
  /diffuse/i,
  /base[_\-. ]?color/i,
  /basecolor/i,
];
const normalPatterns = [
  /(^|[_\-. ])normal([_\-. ]|$)/i,
  /(^|[_\-. ])nrm([_\-. ]|$)/i,
  /(^|[_\-. ])norm([_\-. ]|$)/i,
];

const createCatalogEntry = ({ key, label, folderName, colorFile, normalFile }) => `  ${key}: {
    label: "${label}",
    colorUrl: "${normalizeUrl(folderName, colorFile)}",
    normalUrl: "${normalizeUrl(folderName, normalFile)}",
    tint: "#ffffff",
    accent: "#6d5b43",
    emissive: "#2a2118",
    normalScale: 0.72,
    wallRepeatScale: 1.35,
    floorRepeatScale: 1.3,
    ceilingRepeatScale: 1.1,
  },`;

const getExistingKeys = (catalogSource) =>
  new Set(Array.from(catalogSource.matchAll(/^  ([a-zA-Z][a-zA-Z0-9]*): \{/gm), (match) => match[1]));

const main = async () => {
  const catalogSource = await readFile(catalogPath, "utf8");
  const existingKeys = getExistingKeys(catalogSource);
  const folderEntries = await readdir(texturesDir, { withFileTypes: true });
  const additions = [];
  const skipped = [];

  for (const entry of folderEntries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const folderName = entry.name;
    const key = toCatalogKey(folderName);
    if (!key || existingKeys.has(key)) {
      continue;
    }

    const files = await readdir(path.join(texturesDir, folderName));
    const normalFile = pickTextureFile(files, normalPatterns);
    const colorFile = pickTextureFile(
      files,
      colorPatterns,
      (file) => isImage(file) && file !== normalFile,
    );

    if (!colorFile || !normalFile) {
      skipped.push(`${folderName} (needs color and normal image files)`);
      continue;
    }

    additions.push(createCatalogEntry({
      key,
      label: toLabel(folderName),
      folderName,
      colorFile,
      normalFile,
    }));
  }

  if (additions.length === 0) {
    console.log("Texture catalog already matches public/textures.");
    if (skipped.length > 0) {
      console.log(`Skipped incomplete folders: ${skipped.join(", ")}`);
    }
    return;
  }

  const marker = "} satisfies Record<string, TextureFamilyConfig>;";
  if (!catalogSource.includes(marker)) {
    throw new Error(`Could not find catalog insertion marker: ${marker}`);
  }

  const nextCatalogSource = catalogSource.replace(
    marker,
    `${additions.join("\n")}\n${marker}`,
  );
  await writeFile(catalogPath, nextCatalogSource);

  console.log(`Added ${additions.length} texture family entry/entries.`);
  if (skipped.length > 0) {
    console.log(`Skipped incomplete folders: ${skipped.join(", ")}`);
  }
};

await main();
