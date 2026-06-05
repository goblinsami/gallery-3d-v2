import type { RendererRegistry } from "../core/Registry";
import { createRendererRegistry } from "../core/Registry";
import { ArtworkRenderer } from "./ArtworkRenderer";
import { CtaRenderer } from "./CtaRenderer";
import { ImageRenderer } from "./ImageRenderer";
import { ProfileRenderer } from "./ProfileRenderer";
import { QuoteRenderer } from "./QuoteRenderer";
import { StatementRenderer } from "./StatementRenderer";
import { VideoRenderer } from "./VideoRenderer";

export const createDefaultRendererRegistry = (): RendererRegistry => {
  const registry = createRendererRegistry();
  registry.register(new ArtworkRenderer());
  registry.register(new StatementRenderer());
  registry.register(new QuoteRenderer());
  registry.register(new ProfileRenderer());
  registry.register(new ImageRenderer());
  registry.register(new VideoRenderer());
  registry.register(new CtaRenderer());
  return registry;
};
