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
    left: max(10px, env(safe-area-inset-left, 0px));
    right: max(10px, env(safe-area-inset-right, 0px));
    bottom: max(10px, env(safe-area-inset-bottom, 0px));
    z-index: 4;
    display: flex;
    flex-direction: column;
    height: 104px;
    max-height: min(82%, 620px);
    padding: 0;
    overflow: hidden;
    color: #eef4ff;
    background:
      linear-gradient(150deg, rgba(6, 10, 18, 0.88) 0%, rgba(8, 11, 19, 0.94) 48%, rgba(4, 7, 13, 0.98) 100%);
    border: 1px solid rgba(221, 231, 250, 0.16);
    border-radius: 24px;
    box-shadow:
      0 28px 66px rgba(0, 0, 0, 0.54),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(28px);
    transform: translateY(0);
    transition: height 260ms cubic-bezier(0.24, 0.82, 0.21, 1), border-radius 260ms ease, background 220ms ease;
  }

  .g3d-sheet[hidden] {
    display: none;
  }

  .g3d-sheet[data-state="half"] {
    height: min(58%, 440px);
  }

  .g3d-sheet[data-state="full"] {
    height: calc(100% - max(10px, env(safe-area-inset-top, 0px)));
    max-height: calc(100% - max(10px, env(safe-area-inset-top, 0px)));
    border-radius: 22px 22px 0 0;
  }

  .g3d-sheet[data-state="half"] .g3d-sheet__summary,
  .g3d-sheet[data-state="full"] .g3d-sheet__summary {
    min-height: 60px;
    padding: 7px 14px 13px;
  }

  .g3d-sheet__rail {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 22px;
    padding: 8px 12px 0;
  }

  .g3d-sheet__handle {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

  .g3d-sheet__grip {
    width: 42px;
    height: 4px;
    border-radius: 999px;
    background: rgba(215, 228, 248, 0.8);
  }

  .g3d-sheet__close,
  .g3d-panel__close {
    position: absolute;
    right: var(--g3d-close-right, 10px);
    top: var(--g3d-close-top, 2px);
    padding: var(--g3d-close-padding, 4px);
    border: var(--g3d-close-border, 1px solid rgba(221, 231, 250, 0.22));
    border-radius: var(--g3d-close-radius, 50%);
    color: var(--g3d-close-color, #f2f6ff);
    background: var(--g3d-close-background, radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06)));
    font: var(--g3d-close-font, 800 18px/1 system-ui, sans-serif);
    letter-spacing: 0;
    cursor: pointer;
  }

  .g3d-sheet__close[hidden] {
    display: none;
  }

  .g3d-sheet__handle:focus-visible,
  .g3d-sheet__close:focus-visible,
  .g3d-panel__close:focus-visible,
  .g3d-sheet__summary:focus-visible,
  .g3d-sheet__cta:focus-visible {
    outline: 2px solid rgba(137, 207, 255, 0.94);
    outline-offset: 2px;
  }

  .g3d-sheet__summary {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 74px;
    padding: 7px 14px 22px;
    border: 0;
    color: inherit;
    background: transparent;
    text-align: left;
    cursor: pointer;
  }

  .g3d-sheet__thumb {
    width: 52px;
    height: 52px;
    flex: 0 0 auto;
    object-fit: cover;
    border: 1px solid rgba(221, 231, 250, 0.18);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.04);
  }

  .g3d-sheet__thumb[hidden] {
    display: none;
  }

  .g3d-sheet__summary-copy {
    min-width: 0;
    display: grid;
    gap: 2px;
  }

  .g3d-sheet__eyebrow {
    margin: 0;
    font: 600 11px/1.2 system-ui, sans-serif;
    letter-spacing: 0.11em;
    text-transform: uppercase;
    color: rgba(199, 213, 235, 0.92);
  }

  .g3d-sheet__title {
    margin: 0;
    font: 750 17px/1.18 system-ui, sans-serif;
    letter-spacing: 0;
    color: #f4f8ff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .g3d-sheet__subtitle {
    margin: 0;
    color: rgba(214, 227, 247, 0.84);
    font: 650 12px/1.25 system-ui, sans-serif;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .g3d-sheet__subtitle[hidden] {
    display: none;
  }

  .g3d-sheet__progress {
    flex: 0 0 auto;
    margin: 0 0 0 auto;
    color: rgba(211, 225, 246, 0.96);
    font: 700 12px/1 system-ui, sans-serif;
    letter-spacing: 0.08em;
  }

  .g3d-sheet__progress[hidden] {
    display: none;
  }

  .g3d-sheet__body {
    flex: 1;
    min-height: 0;
    padding: 8px 18px calc(18px + env(safe-area-inset-bottom, 0px));
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: rgba(170, 194, 228, 0.55) transparent;
  }

  .g3d-sheet__body[hidden] {
    display: none;
  }

  .g3d-sheet__description {
    margin: 0;
    font: 500 15px/1.55 system-ui, sans-serif;
    color: rgba(235, 242, 252, 0.96);
    white-space: pre-wrap;
  }

  .g3d-sheet__description[hidden] {
    display: none;
  }

  .g3d-sheet__section {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid rgba(190, 206, 228, 0.15);
  }

  .g3d-sheet__section-title {
    margin: 0 0 6px;
    color: rgba(183, 202, 230, 0.92);
    font: 750 12px/1.2 system-ui, sans-serif;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .g3d-sheet__list {
    display: grid;
    gap: 6px;
    margin: 0;
    padding-left: 16px;
    color: rgba(224, 234, 249, 0.94);
    font: 500 14px/1.45 system-ui, sans-serif;
  }

  .g3d-sheet__list--links {
    padding-left: 0;
    list-style: none;
  }

  .g3d-sheet__list--links a,
  .g3d-sheet__cta {
    color: #d7ecff;
    text-decoration: none;
  }

  .g3d-sheet__list--links a:hover,
  .g3d-sheet__cta:hover {
    text-decoration: underline;
  }

  .g3d-sheet__cta {
    display: inline-flex;
    width: fit-content;
    margin-top: 16px;
    font: 700 13px/1.2 system-ui, sans-serif;
  }

  .g3d-sheet__cta[hidden],
  .g3d-sheet__links[hidden] {
    display: none;
  }

  .g3d-panel {
    display: none;
  }

  @media (min-width: 860px) {
    .g3d-sheet {
      left: 50%;
      right: auto;
      width: min(720px, calc(100% - 48px));
      max-height: min(82%, 620px);
      transform: translateX(-50%);
    }

    .g3d-sheet[data-state="half"],
    .g3d-sheet[data-state="full"] {
      display: none;
    }

    .g3d-panel {
      display: block;
      position: absolute;
      left: max(4px, env(safe-area-inset-left));
      top: max(8px, env(safe-area-inset-top));
      bottom: max(8px, env(safe-area-inset-bottom));
      z-index: 4;
      width: clamp(360px, 25.5vw, 468px);
      max-width: calc(100% - 72px);
      padding: 42px 18px 18px;
      overflow: auto;
      color: #f4efe6;
      background: rgba(4, 7, 13, 0.9);
      border: 1px solid rgba(201, 211, 232, 0.16);
      border-radius: 18px;
      box-shadow: 0 18px 70px rgba(0, 0, 0, 0.34);
      backdrop-filter: blur(16px);
      transform: translateX(0);
    }

    .g3d-panel[data-state="collapsed"] {
      display: none;
    }

    .g3d-panel__grip {
      width: 44px;
      height: 4px;
      margin: -24px auto 18px;
      border-radius: 999px;
      background: rgba(201, 211, 232, 0.72);
    }

    .g3d-panel__eyebrow {
      margin: 0 0 4px;
      font: 600 11px/1.2 system-ui, sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: rgba(217, 225, 242, 0.72);
    }

    .g3d-panel__title {
      margin: 0;
      font: 750 17px/1.14 system-ui, sans-serif;
    }

    .g3d-panel__description {
      margin: 28px 0 0;
      padding-top: 28px;
      border-top: 1px solid rgba(201, 211, 232, 0.14);
      font: 400 16px/1.55 system-ui, sans-serif;
      color: rgba(244, 239, 230, 0.9);
    }

    .g3d-panel__actions {
      display: flex;
      gap: 8px;
      margin-top: 28px;
    }

    .g3d-panel__nav {
      flex: 1;
      min-height: 34px;
      border: 1px solid rgba(244, 239, 230, 0.18);
      border-radius: 7px;
      color: #f4efe6;
      background: rgba(255, 255, 255, 0.08);
      font: 600 11px/1 system-ui, sans-serif;
      cursor: pointer;
    }
  }

  :host([force-mobile]) .g3d-sheet {
    display: flex;
    left: max(10px, env(safe-area-inset-left, 0px));
    right: max(10px, env(safe-area-inset-right, 0px));
    width: auto;
    transform: translateY(0);
  }

  :host([force-mobile]) .g3d-sheet[hidden] {
    display: none;
  }

  :host([force-mobile]) .g3d-sheet[data-state="half"] {
    display: flex;
    height: min(58%, 440px);
  }

  :host([force-mobile]) .g3d-sheet[data-state="full"] {
    display: flex;
    height: calc(100% - max(10px, env(safe-area-inset-top, 0px)));
    max-height: calc(100% - max(10px, env(safe-area-inset-top, 0px)));
    border-radius: 22px 22px 0 0;
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
