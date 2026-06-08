# Agent Notes

## Legacy Reference

- `showcase/gallery-3d` is the legacy version of this project.
- It contains many lessons learned, interaction decisions, rendering tradeoffs, and prior solutions that should inform work in this current `showcase/gallery-3d-v2` project.
- When investigating regressions, interaction feel, scroll behavior, layout decisions, or rendering polish, check the legacy project as historical context before inventing a new approach.
- Treat legacy code as reference material, not as a direct source to copy blindly: adapt ideas to the current architecture and keep changes focused.

## Specialized Agents

- `.agents/TextureMappingAgent.md` owns the workflow for new folders in `public/textures`, including catalog sync, selector exposure, tuning, and verification.
