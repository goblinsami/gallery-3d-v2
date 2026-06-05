import type { ContentSurfaceModel, ContentSurfaceUnsubscribe } from "../types/ContentSurface";
import type { RuntimeInstance } from "../types/Runtime";

export interface BottomSheetView {
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
  const title = root.querySelector<HTMLElement>(".g3d-sheet__title");
  const eyebrow = root.querySelector<HTMLElement>(".g3d-sheet__eyebrow");
  const body = root.querySelector<HTMLElement>(".g3d-sheet__body");
  const description = root.querySelector<HTMLElement>(".g3d-sheet__description");

  if (eyebrow) {
    eyebrow.textContent = model.content?.eyebrow ?? model.item?.type ?? "";
  }

  if (title) {
    title.textContent = model.content?.title ?? "Gallery3D";
  }

  if (description) {
    description.textContent = model.content?.description ?? model.content?.body ?? "";
  }

  if (body) {
    body.hidden = model.state === "collapsed";
  }
};

export const createBottomSheetView = (
  runtime: RuntimeInstance,
): BottomSheetView => {
  const root = createElement("section", "g3d-sheet");
  const handle = createElement("button", "g3d-sheet__handle");
  const grip = createElement("span", "g3d-sheet__grip");
  const summary = createElement("div", "g3d-sheet__summary");
  const eyebrow = createElement("p", "g3d-sheet__eyebrow");
  const title = createElement("h2", "g3d-sheet__title");
  const body = createElement("div", "g3d-sheet__body");
  const description = createElement("p", "g3d-sheet__description");
  const actions = createElement("div", "g3d-sheet__actions");
  const previous = createElement("button", "g3d-sheet__nav");
  const next = createElement("button", "g3d-sheet__nav");
  let unsubscribe: ContentSurfaceUnsubscribe | null = null;

  handle.type = "button";
  handle.setAttribute("aria-label", "Toggle content");
  previous.type = "button";
  next.type = "button";
  previous.textContent = "Previous";
  next.textContent = "Next";
  previous.setAttribute("aria-label", "Previous item");
  next.setAttribute("aria-label", "Next item");
  body.hidden = true;
  handle.append(grip);
  summary.append(eyebrow, title);
  actions.append(previous, next);
  body.append(description);
  root.append(handle, summary, body, actions);

  const cycleState = (): void => {
    const current = runtime.getContentSurface().state;
    const next = current === "collapsed" ? "half" : current === "half" ? "full" : "collapsed";
    runtime.setBottomSheetState(next);
  };
  const collapse = (): void => runtime.setBottomSheetState("collapsed");
  const goPrevious = (): void => {
    runtime.previousItem();
  };
  const goNext = (): void => {
    runtime.nextItem();
  };

  handle.addEventListener("click", cycleState);
  summary.addEventListener("click", cycleState);
  root.addEventListener("dblclick", collapse);
  previous.addEventListener("click", goPrevious);
  next.addEventListener("click", goNext);
  unsubscribe = runtime.subscribeContentSurface((model) => renderModel(root, model));

  return {
    element: root,
    dispose: () => {
      unsubscribe?.();
      handle.removeEventListener("click", cycleState);
      summary.removeEventListener("click", cycleState);
      root.removeEventListener("dblclick", collapse);
      previous.removeEventListener("click", goPrevious);
      next.removeEventListener("click", goNext);
      root.remove();
    },
  };
};
