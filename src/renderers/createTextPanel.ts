import {
  BoxGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
} from "three";
import type { GalleryContentProjection, PositionedGalleryItem } from "../types/GalleryItem";
import type { RenderResources } from "../types/Renderer";

export interface TextPanelOptions {
  width: number;
  height: number;
  background: string;
  foreground: string;
  accent: string;
  showFrame?: boolean;
}

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;

const drawWrappedText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number => {
  const words = text.split(/\s+/);
  let line = "";
  let cursorY = y;

  words.forEach((word) => {
    const nextLine = line.length > 0 ? `${line} ${word}` : word;
    if (context.measureText(nextLine).width > maxWidth && line.length > 0) {
      context.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
      return;
    }

    line = nextLine;
  });

  if (line.length > 0) {
    context.fillText(line, x, cursorY);
  }

  return cursorY + lineHeight;
};

const createTextTexture = (
  content: GalleryContentProjection,
  options: TextPanelOptions,
  stationLayout: boolean,
): CanvasTexture => {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const context = canvas.getContext("2d");

  if (context) {
    context.fillStyle = options.background;
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.fillStyle = options.accent;
    context.fillRect(64, 64, 96, 6);

    context.fillStyle = options.foreground;
    context.textBaseline = "top";

    if (stationLayout) {
      context.textAlign = "center";
      context.fillStyle = options.accent;
      context.fillRect(CANVAS_WIDTH / 2 - 48, 96, 96, 5);
      if (content.eyebrow) {
        context.font = "700 30px system-ui, sans-serif";
        context.globalAlpha = 0.72;
        context.fillText(content.eyebrow.toUpperCase(), CANVAS_WIDTH / 2, 128);
        context.globalAlpha = 1;
      }

      context.fillStyle = options.foreground;
      context.font = "800 86px system-ui, sans-serif";
      drawCenteredText(context, (content.title ?? "").toUpperCase(), CANVAS_WIDTH / 2, 292, 820, 86);
      context.font = "500 34px system-ui, sans-serif";
      context.globalAlpha = 0.72;
      drawCenteredText(
        context,
        content.description ?? content.body ?? content.subtitle ?? "",
        CANVAS_WIDTH / 2,
        548,
        760,
        44,
      );
      context.globalAlpha = 1;
    } else if (content.eyebrow) {
      context.font = "500 34px system-ui, sans-serif";
      context.globalAlpha = 0.72;
      context.fillText(content.eyebrow.toUpperCase(), 64, 96);
      context.globalAlpha = 1;

      context.font = "600 76px system-ui, sans-serif";
      const titleEnd = drawWrappedText(context, content.title ?? "", 64, 160, 860, 88);

      context.font = "400 38px system-ui, sans-serif";
      context.globalAlpha = 0.78;
      drawWrappedText(
        context,
        content.description ?? content.body ?? content.subtitle ?? "",
        64,
        titleEnd + 34,
        840,
        52,
      );
      context.globalAlpha = 1;
    } else {
      context.font = "600 76px system-ui, sans-serif";
      const titleEnd = drawWrappedText(context, content.title ?? "", 64, 160, 860, 88);
      context.font = "400 38px system-ui, sans-serif";
      context.globalAlpha = 0.78;
      drawWrappedText(
        context,
        content.description ?? content.body ?? content.subtitle ?? "",
        64,
        titleEnd + 34,
        840,
        52,
      );
      context.globalAlpha = 1;
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = "srgb";
  texture.needsUpdate = true;
  return texture;
};

const drawCenteredText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number => {
  const words = text.split(/\s+/);
  let line = "";
  let cursorY = y;

  words.forEach((word) => {
    const nextLine = line.length > 0 ? `${line} ${word}` : word;
    if (context.measureText(nextLine).width > maxWidth && line.length > 0) {
      context.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
      return;
    }

    line = nextLine;
  });

  if (line.length > 0) {
    context.fillText(line, x, cursorY);
  }

  return cursorY + lineHeight;
};

export const createTextPanel = (
  item: PositionedGalleryItem,
  content: GalleryContentProjection,
  options: TextPanelOptions,
  resources: RenderResources,
): Group => {
  const root = new Group();
  const isCenter = item.placement.side === "center";
  const showFrame = options.showFrame ?? true;
  const texture = createTextTexture(content, options, isCenter);
  const panel = new Mesh(
    resources.unitPlane,
    new MeshBasicMaterial({
      map: texture,
      side: DoubleSide,
      toneMapped: false,
    }),
  );
  const backing = new Mesh(
    resources.unitPlane,
    resources.getStandardSurface(new Color(options.background).multiplyScalar(0.45).getStyle(), 0.68, 0.14),
  );

  panel.scale.set(options.width, options.height, 1);
  root.add(panel);

  if (showFrame) {
    backing.scale.set(options.width + 0.08, options.height + 0.08, 1);
    backing.position.z = -0.025;
    root.add(backing);

    if (isCenter) {
      root.add(createStationPortal(options.width, options.height));
    } else {
      root.add(createWallFrame(options.width, options.height, options.accent));
    }
  }

  root.position.set(item.position.x, item.position.y, item.position.z);
  root.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
  root.name = `${item.type}:${item.id}`;

  return root;
};

const createBar = (
  width: number,
  height: number,
  depth: number,
  material: MeshStandardMaterial | MeshBasicMaterial,
): Mesh => new Mesh(new BoxGeometry(width, height, depth), material);

const createStationPortal = (panelWidth: number, panelHeight: number): Group => {
  const root = new Group();
  const frameMaterial = new MeshStandardMaterial({
    color: "#15120f",
    roughness: 0.48,
    metalness: 0.22,
  });
  const ledMaterial = new MeshBasicMaterial({
    color: "#fff5d6",
    toneMapped: false,
  });
  const width = panelWidth + 1.18;
  const height = panelHeight + 0.72;
  const thickness = 0.12;
  const top = createBar(width, thickness, 0.14, frameMaterial);
  const bottom = createBar(width, thickness, 0.14, frameMaterial);
  const left = createBar(thickness, height, 0.14, frameMaterial);
  const right = createBar(thickness, height, 0.14, frameMaterial);
  const led = createBar(width - 0.28, 0.025, 0.025, ledMaterial);

  top.position.set(0, height / 2, -0.05);
  bottom.position.set(0, -height / 2, -0.05);
  left.position.set(-width / 2, 0, -0.05);
  right.position.set(width / 2, 0, -0.05);
  led.position.set(0, height / 2 - 0.16, 0.045);
  root.name = "station-portal-frame";
  root.add(top, bottom, left, right, led);
  return root;
};

const createWallFrame = (panelWidth: number, panelHeight: number, accent: string): Group => {
  const root = new Group();
  const frameMaterial = new MeshStandardMaterial({
    color: "#0f0e0c",
    roughness: 0.56,
    metalness: 0.18,
  });
  const ledMaterial = new MeshBasicMaterial({
    color: accent,
    toneMapped: false,
  });
  const thickness = 0.055;
  const top = createBar(panelWidth + 0.18, thickness, 0.06, frameMaterial);
  const bottom = createBar(panelWidth + 0.18, thickness, 0.06, frameMaterial);
  const left = createBar(thickness, panelHeight + 0.18, 0.045, frameMaterial);
  const right = createBar(thickness, panelHeight + 0.18, 0.045, frameMaterial);
  const glow = createBar(panelWidth * 0.42, 0.022, 0.022, ledMaterial);

  top.position.set(0, panelHeight / 2 + 0.075, 0.035);
  bottom.position.set(0, -panelHeight / 2 - 0.075, 0.035);
  left.position.set(-panelWidth / 2 - 0.075, 0, 0.035);
  right.position.set(panelWidth / 2 + 0.075, 0, 0.035);
  glow.position.set(-panelWidth * 0.22, panelHeight / 2 + 0.12, 0.075);
  root.name = "wall-panel-frame";
  root.add(top, bottom, left, right, glow);
  return root;
};
