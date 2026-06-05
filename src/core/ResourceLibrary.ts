import {
  BoxGeometry,
  Color,
  DoubleSide,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
} from "three";

export class ResourceLibrary {
  readonly unitPlane = new PlaneGeometry(1, 1);
  readonly unitBox = new BoxGeometry(1, 1, 1);
  private readonly basicMaterials = new Map<string, MeshBasicMaterial>();
  private readonly standardMaterials = new Map<string, MeshStandardMaterial>();
  private readonly glowMaterials = new Map<string, MeshBasicMaterial>();

  getBasicSurface(color: string): MeshBasicMaterial {
    const key = `basic:${color}`;
    const existing = this.basicMaterials.get(key);
    if (existing) {
      return existing;
    }

    const material = new MeshBasicMaterial({
      color: new Color(color),
      side: DoubleSide,
      toneMapped: false,
    });
    this.basicMaterials.set(key, material);
    return material;
  }

  getStandardSurface(color: string, roughness: number, metalness: number): MeshStandardMaterial {
    const key = `standard:${color}:${roughness}:${metalness}`;
    const existing = this.standardMaterials.get(key);
    if (existing) {
      return existing;
    }

    const material = new MeshStandardMaterial({
      color,
      roughness,
      metalness,
    });
    this.standardMaterials.set(key, material);
    return material;
  }

  getGlow(color: string, opacity: number): MeshBasicMaterial {
    const key = `glow:${color}:${opacity}`;
    const existing = this.glowMaterials.get(key);
    if (existing) {
      return existing;
    }

    const material = new MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      side: DoubleSide,
      toneMapped: false,
    });
    this.glowMaterials.set(key, material);
    return material;
  }
}
