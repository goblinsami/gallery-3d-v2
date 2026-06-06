import { Mesh, MeshBasicMaterial, Shape, ShapeGeometry } from "three";
import type { Object3D } from "three";
import type { PositionedGalleryItem } from "../types/GalleryItem";
import type { ItemRenderer, RendererContext } from "../types/Renderer";
import { createMediaFrame } from "./createMediaFrame";
import { fitFrameToAspectRatio, getTextureAspectRatio } from "./mediaAspectRatio";

const createPlayIcon = (): Mesh => {
  const shape = new Shape();
  shape.moveTo(-0.18, -0.24);
  shape.lineTo(0.28, 0);
  shape.lineTo(-0.18, 0.24);
  shape.closePath();

  return new Mesh(
    new ShapeGeometry(shape),
    new MeshBasicMaterial({
      color: "#f5f0e8",
      transparent: true,
      opacity: 0.9,
      toneMapped: false,
    }),
  );
};

export class VideoRenderer implements ItemRenderer {
  readonly type = "video";

  async create(item: PositionedGalleryItem, context: RendererContext): Promise<Object3D> {
    const texture = await context.assets.getTextureForItem(item);
    const frameSize = fitFrameToAspectRatio({
      width: item.bounds?.width ?? 2.8,
      height: item.bounds?.height ?? 1.58,
    }, getTextureAspectRatio(texture));
    const root = createMediaFrame(item, {
      width: frameSize.width,
      height: frameSize.height,
      surfaceColor: context.quality.preset === "low" ? "#242626" : "#101314",
      frameColor: "#151716",
      emissive: "#6f9ca3",
      texture,
    }, context.resources);
    const icon = createPlayIcon();
    icon.position.z = 0.05;
    root.add(icon);

    return root;
  }
}
