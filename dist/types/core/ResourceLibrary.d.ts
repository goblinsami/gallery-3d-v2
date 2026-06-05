import { BoxGeometry, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry } from "three";
export declare class ResourceLibrary {
    readonly unitPlane: PlaneGeometry;
    readonly unitBox: BoxGeometry;
    private readonly basicMaterials;
    private readonly standardMaterials;
    private readonly glowMaterials;
    getBasicSurface(color: string): MeshBasicMaterial;
    getStandardSurface(color: string, roughness: number, metalness: number): MeshStandardMaterial;
    getGlow(color: string, opacity: number): MeshBasicMaterial;
}
//# sourceMappingURL=ResourceLibrary.d.ts.map