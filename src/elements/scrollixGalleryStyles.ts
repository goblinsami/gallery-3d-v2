export const scrollixGalleryStyles = `
  :host {
    display: block;
    position: relative;
    contain: layout paint size;
    min-height: 420px;
    overflow: hidden;
    background: #1f211d;
  }

  .viewport {
    position: absolute;
    inset: 0;
    min-width: 1px;
    min-height: 1px;
    touch-action: none;
  }

  .white-overlay {
    position: absolute;
    inset: 0;
    z-index: 10000;
    pointer-events: none;
    background: #ffffff;
    opacity: 0;
    transition: opacity 80ms linear;
    will-change: opacity;
    transform: translateZ(0);
  }

  .progress {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 5;
    height: 2px;
    overflow: hidden;
    background: rgba(244, 239, 230, 0.12);
  }

  .progress__fill {
    width: 100%;
    height: 100%;
    background: rgba(244, 239, 230, 0.72);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 120ms ease;
  }

  .g3d-sheet {
    position: absolute;
    left: max(10px, env(safe-area-inset-left));
    right: max(10px, env(safe-area-inset-right));
    bottom: max(10px, env(safe-area-inset-bottom));
    z-index: 4;
    min-height: 76px;
    max-height: min(82%, 620px);
    padding: 10px 16px 16px;
    overflow: hidden;
    color: #f4efe6;
    background: rgba(23, 23, 21, 0.82);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 18px 18px 8px 8px;
    box-shadow: 0 18px 60px rgba(0, 0, 0, 0.28);
    backdrop-filter: blur(18px);
    transform: translateY(0);
    transition: min-height 220ms ease, max-height 220ms ease, background 220ms ease;
  }

  .g3d-sheet[data-state="half"] {
    min-height: 38%;
  }

  .g3d-sheet[data-state="full"] {
    min-height: calc(100% - max(10px, env(safe-area-inset-top)));
    max-height: calc(100% - max(10px, env(safe-area-inset-top)));
    border-radius: 18px 18px 0 0;
  }

  .g3d-sheet__handle {
    display: grid;
    place-items: center;
    width: 100%;
    height: 22px;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  .g3d-sheet__grip {
    width: 42px;
    height: 4px;
    border-radius: 999px;
    background: rgba(244, 239, 230, 0.42);
  }

  .g3d-sheet__summary {
    cursor: pointer;
  }

  .g3d-sheet__eyebrow {
    margin: 8px 0 4px;
    font: 600 11px/1.2 system-ui, sans-serif;
    letter-spacing: 0;
    text-transform: uppercase;
    opacity: 0.68;
  }

  .g3d-sheet__title {
    margin: 0;
    font: 650 18px/1.16 system-ui, sans-serif;
    letter-spacing: 0;
  }

  .g3d-sheet__body {
    margin-top: 16px;
    overflow: auto;
    max-height: calc(100% - 86px);
  }

  .g3d-sheet__description {
    margin: 0;
    font: 400 14px/1.55 system-ui, sans-serif;
    color: rgba(244, 239, 230, 0.76);
  }

  .g3d-sheet__actions {
    display: flex;
    gap: 8px;
    margin-top: 14px;
  }

  .g3d-sheet__nav {
    flex: 1;
    min-height: 36px;
    border: 1px solid rgba(244, 239, 230, 0.18);
    border-radius: 8px;
    color: #f4efe6;
    background: rgba(255, 255, 255, 0.08);
    font: 600 13px/1 system-ui, sans-serif;
    cursor: pointer;
  }

  .g3d-panel {
    display: none;
  }

  @media (min-width: 860px) {
    .g3d-sheet {
      display: none;
    }

    .g3d-panel {
      display: block;
      position: absolute;
      left: 50%;
      bottom: 26px;
      z-index: 4;
      width: min(720px, calc(100% - 48px));
      min-height: 70px;
      padding: 14px 18px 16px;
      color: #f4efe6;
      background: rgba(8, 9, 10, 0.88);
      border: 1px solid rgba(244, 226, 194, 0.16);
      border-radius: 18px;
      box-shadow: 0 18px 60px rgba(0, 0, 0, 0.22);
      backdrop-filter: blur(16px);
      transform: translateX(-50%);
    }

    .g3d-panel__grip {
      width: 44px;
      height: 4px;
      margin: 0 auto 10px;
      border-radius: 999px;
      background: rgba(244, 239, 230, 0.58);
    }

    .g3d-panel__eyebrow {
      margin: 0 0 6px;
      font: 600 11px/1.2 system-ui, sans-serif;
      text-transform: uppercase;
      opacity: 0.66;
    }

    .g3d-panel__title {
      margin: 0;
      font: 700 18px/1.18 system-ui, sans-serif;
    }

    .g3d-panel__description {
      margin: 4px 160px 0 0;
      font: 400 14px/1.55 system-ui, sans-serif;
      color: rgba(244, 239, 230, 0.74);
    }

    .g3d-panel__actions {
      display: flex;
      gap: 8px;
      position: absolute;
      right: 18px;
      bottom: 16px;
      width: 172px;
    }

    .g3d-panel__nav {
      flex: 1;
      min-height: 30px;
      border: 1px solid rgba(244, 239, 230, 0.18);
      border-radius: 7px;
      color: #f4efe6;
      background: rgba(255, 255, 255, 0.08);
      font: 600 11px/1 system-ui, sans-serif;
      cursor: pointer;
    }
  }

  :host([force-mobile]) .g3d-sheet {
    display: block;
  }

  :host([force-mobile]) .g3d-panel {
    display: none;
  }

  :host([force-mobile]) {
    width: min(390px, calc(100vw - 24px)) !important;
    height: min(844px, calc(100dvh - 24px)) !important;
    min-height: 0;
    margin: 12px auto;
    border: 1px solid rgba(244, 239, 230, 0.18);
    border-radius: 30px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.42);
  }
`;
