import type { ContentSurfaceModel, ContentSurfaceUnsubscribe } from "../types/ContentSurface";
import type { RuntimeInstance } from "../types/Runtime";

export interface DesktopPanelView {
  element: HTMLElement;
  dispose(): void;
}

const createElement = <T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  className: string,
): HTMLElementTagNameMap[T] => {
  const element = document.createElement(tagName);
  element.className = className;
  return element;
};

const renderModel = (root: HTMLElement, model: ContentSurfaceModel): void => {
  root.dataset.state = model.state;
  const eyebrow = root.querySelector<HTMLElement>(".g3d-panel__eyebrow");
  const title = root.querySelector<HTMLElement>(".g3d-panel__title");
  const description = root.querySelector<HTMLElement>(".g3d-panel__description");

  if (eyebrow) {
    eyebrow.textContent = model.content?.eyebrow ?? model.item?.type ?? "";
  }

  if (title) {
    title.textContent = model.content?.title ?? "Gallery3D";
  }

  if (description) {
    description.textContent = model.content?.description ?? model.content?.body ?? "";
  }
};

export const createDesktopPanelView = (
  runtime: RuntimeInstance,
): DesktopPanelView => {
  const root = createElement("aside", "g3d-panel");
  const grip = createElement("div", "g3d-panel__grip");
  const close = createElement("button", "g3d-panel__close");
  const eyebrow = createElement("p", "g3d-panel__eyebrow");
  const title = createElement("h2", "g3d-panel__title");
  const description = createElement("p", "g3d-panel__description");
  const actions = createElement("div", "g3d-panel__actions");
  const previous = createElement("button", "g3d-panel__nav");
  const next = createElement("button", "g3d-panel__nav");
  let unsubscribe: ContentSurfaceUnsubscribe | null = null;

  close.type = "button";
  close.setAttribute("aria-label", "Close content");
  previous.type = "button";
  next.type = "button";
  previous.textContent = "Previous";
  next.textContent = "Next";
  previous.setAttribute("aria-label", "Previous item");
  next.setAttribute("aria-label", "Next item");
  actions.append(previous, next);
  root.append(grip, close, eyebrow, title, description, actions);

  const closePanel = (): void => {
    runtime.setBottomSheetState("collapsed");
  };
  const goPrevious = (): void => {
    runtime.previousItem();
  };
  const goNext = (): void => {
    runtime.nextItem();
  };

  close.addEventListener("click", closePanel);
  previous.addEventListener("click", goPrevious);
  next.addEventListener("click", goNext);
  unsubscribe = runtime.subscribeContentSurface((model) => renderModel(root, model));

  return {
    element: root,
    dispose: () => {
      unsubscribe?.();
      close.removeEventListener("click", closePanel);
      previous.removeEventListener("click", goPrevious);
      next.removeEventListener("click", goNext);
      root.remove();
    },
  };
};
