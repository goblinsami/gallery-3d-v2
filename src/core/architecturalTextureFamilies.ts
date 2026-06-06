import type { MaterialFamily } from "../types/GalleryProject";

export type TexturedMaterialFamily = "stone" | "brick" | "wood";

export interface TextureFamilyConfig {
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

export const TEXTURE_LIBRARY: Record<TexturedMaterialFamily, TextureFamilyConfig> = {
  stone: {
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
};

export const resolveTextureFamily = (materialFamily: MaterialFamily): TexturedMaterialFamily =>
  materialFamily === "brick" || materialFamily === "wood" ? materialFamily : "stone";

const pseudoRandom01 = (seed: number): number => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const createTextureCanvas = (
  size: number,
): { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Cannot create procedural architectural texture.");
  }

  return { canvas, context };
};

export const drawStoneTexture = (size: number): HTMLCanvasElement => {
  const { canvas, context } = createTextureCanvas(size);
  context.fillStyle = "#2b2721";
  context.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += 6) {
    const tone = 36 + Math.round((Math.sin(y * 0.04) + 1) * 18);
    context.strokeStyle = `rgb(${tone + 16}, ${tone + 10}, ${tone})`;
    context.globalAlpha = 0.12;
    context.beginPath();
    context.moveTo(0, y);
    context.bezierCurveTo(size * 0.26, y - 18, size * 0.58, y + 22, size, y - 8);
    context.stroke();
  }

  context.globalAlpha = 0.22;
  context.strokeStyle = "#0f0d0a";
  for (let x = size / 3; x < size; x += size / 3) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + Math.sin(x) * 8, size);
    context.stroke();
  }
  context.globalAlpha = 1;
  return canvas;
};

export const drawWoodTexture = (size: number): HTMLCanvasElement => {
  const { canvas, context } = createTextureCanvas(size);
  const gradient = context.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "#8a6540");
  gradient.addColorStop(0.5, "#5a3d25");
  gradient.addColorStop(1, "#9b7046");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += 1) {
    const wave = Math.sin(y * 0.035) * 8 + Math.sin(y * 0.011) * 18;
    context.globalAlpha = 0.12 + (Math.sin(y * 0.09) + 1) * 0.035;
    context.strokeStyle = y % 13 === 0 ? "#c0925d" : "#3b2919";
    context.beginPath();
    context.moveTo(0, y + wave * 0.05);
    context.bezierCurveTo(size * 0.32, y + wave, size * 0.68, y - wave, size, y + wave * 0.12);
    context.stroke();
  }

  context.globalAlpha = 0.16;
  context.fillStyle = "#2a1d12";
  for (let x = 0; x < size; x += size / 4) {
    context.fillRect(x, 0, 2, size);
  }
  context.globalAlpha = 1;
  return canvas;
};

export const drawBrickColorTexture = (size: number): HTMLCanvasElement => {
  const { canvas, context } = createTextureCanvas(size);
  context.fillStyle = "#3f3b2f";
  context.fillRect(0, 0, size, size);

  const cell = size / 8;
  const mortar = Math.max(2, size * 0.004);
  const palette = ["#b65d43", "#9a5143", "#cc7450", "#7d4e45"];

  for (let y = -cell; y < size + cell; y += cell) {
    for (let x = -cell; x < size + cell; x += cell) {
      const vertical = (Math.round(x / cell) + Math.round(y / cell)) % 2 === 0;
      const tone = palette[Math.abs(Math.round(x + y)) % palette.length];
      const brickX = x + mortar;
      const brickY = y + mortar;
      const brickW = vertical ? cell * 0.48 - mortar * 1.5 : cell - mortar * 2;
      const brickH = vertical ? cell - mortar * 2 : cell * 0.48 - mortar * 1.5;

      context.fillStyle = tone;
      context.fillRect(brickX, brickY, brickW, brickH);
      context.fillRect(
        vertical ? brickX + cell * 0.5 : brickX,
        vertical ? brickY : brickY + cell * 0.5,
        brickW,
        brickH,
      );

      context.globalAlpha = 0.16;
      context.fillStyle = "#f0a074";
      context.fillRect(
        brickX + brickW * 0.12,
        brickY + brickH * 0.12,
        brickW * 0.55,
        Math.max(1, brickH * 0.06),
      );
      context.globalAlpha = 0.12;
      context.fillStyle = "#1d1712";
      context.fillRect(brickX, brickY + brickH * 0.82, brickW, Math.max(1, brickH * 0.08));
      context.globalAlpha = 1;
    }
  }

  for (let i = 0; i < size * 0.018; i += 1) {
    const x = pseudoRandom01(i + 11) * size;
    const y = pseudoRandom01(i + 53) * size;
    context.globalAlpha = 0.16;
    context.fillStyle = i % 3 === 0 ? "#1f2a1d" : "#e2a26f";
    context.fillRect(x, y, 1.2, 1.2);
  }

  context.globalAlpha = 1;
  return canvas;
};

export const drawBrickNormalTexture = (size: number): HTMLCanvasElement => {
  const { canvas, context } = createTextureCanvas(size);
  context.fillStyle = "#8080ff";
  context.fillRect(0, 0, size, size);

  const cell = size / 8;
  const mortar = Math.max(2, size * 0.004);
  context.lineWidth = mortar;

  for (let y = -cell; y < size + cell; y += cell) {
    for (let x = -cell; x < size + cell; x += cell) {
      const vertical = (Math.round(x / cell) + Math.round(y / cell)) % 2 === 0;
      const firstX = x + mortar * 0.5;
      const firstY = y + mortar * 0.5;

      context.strokeStyle = "#55c7ff";
      context.strokeRect(firstX, firstY, vertical ? cell * 0.5 : cell, vertical ? cell : cell * 0.5);
      context.strokeStyle = "#ce65ff";
      context.strokeRect(
        vertical ? firstX + cell * 0.5 : firstX,
        vertical ? firstY : firstY + cell * 0.5,
        vertical ? cell * 0.5 : cell,
        vertical ? cell : cell * 0.5,
      );
    }
  }

  context.globalAlpha = 0.22;
  context.strokeStyle = "#6f74ff";
  for (let i = 0; i < 34; i += 1) {
    const x = pseudoRandom01(i + 101) * size;
    const y = pseudoRandom01(i + 173) * size;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + Math.sin(i) * cell * 0.45, y + Math.cos(i) * cell * 0.28);
    context.stroke();
  }

  context.globalAlpha = 1;
  return canvas;
};
