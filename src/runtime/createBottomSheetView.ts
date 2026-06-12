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
  const subtitle = root.querySelector<HTMLElement>(".g3d-sheet__subtitle");
  const progress = root.querySelector<HTMLElement>(".g3d-sheet__progress");
  const close = root.querySelector<HTMLElement>(".g3d-sheet__close");
  const thumb = root.querySelector<HTMLImageElement>(".g3d-sheet__thumb");
  const body = root.querySelector<HTMLElement>(".g3d-sheet__body");
  const description = root.querySelector<HTMLElement>(".g3d-sheet__description");
  const sections = root.querySelector<HTMLElement>(".g3d-sheet__sections");
  const links = root.querySelector<HTMLElement>(".g3d-sheet__links");
  const cta = root.querySelector<HTMLAnchorElement>(".g3d-sheet__cta");
  const content = model.content;

  root.hidden = !model.item;

  if (eyebrow) {
    eyebrow.textContent = content?.eyebrow ?? model.item?.type ?? "";
  }

  if (title) {
    title.textContent = content?.title ?? "Gallery3D";
  }

  if (subtitle) {
    subtitle.textContent = content?.subtitle ?? "";
    subtitle.hidden = !content?.subtitle;
  }

  if (progress) {
    progress.textContent = content?.progressLabel ?? "";
    progress.hidden = !content?.progressLabel;
  }

  if (close) {
    close.hidden = model.state === "collapsed";
  }

  if (thumb) {
    const thumbnailUrl = content?.thumbnailUrl;
    thumb.hidden = !thumbnailUrl;
    if (thumbnailUrl) {
      thumb.src = thumbnailUrl;
      thumb.alt = `${content?.title ?? "Gallery item"} thumbnail`;
    } else {
      thumb.removeAttribute("src");
      thumb.alt = "";
    }
  }

  if (description) {
    const text = content?.description ?? content?.body ?? "";
    description.textContent = text;
    description.hidden = text.length === 0;
  }

  if (body) {
    body.hidden = model.state === "collapsed";
  }

  if (sections) {
    sections.replaceChildren();
    (content?.sections ?? []).forEach((section) => {
      if (section.lines.length === 0) {
        return;
      }

      const sectionElement = createElement("section", "g3d-sheet__section");
      const heading = createElement("h3", "g3d-sheet__section-title");
      const list = createElement("ul", "g3d-sheet__list");
      heading.textContent = section.title;
      section.lines.forEach((line) => {
        const item = document.createElement("li");
        item.textContent = line;
        list.appendChild(item);
      });
      sectionElement.append(heading, list);
      sections.appendChild(sectionElement);
    });
  }

  if (links) {
    links.replaceChildren();
    const socialLinks = content?.socialLinks ?? [];
    links.hidden = socialLinks.length === 0;
    if (socialLinks.length > 0) {
      const heading = createElement("h3", "g3d-sheet__section-title");
      const list = createElement("ul", "g3d-sheet__list g3d-sheet__list--links");
      heading.textContent = "Links";
      socialLinks.forEach((link) => {
        const item = document.createElement("li");
        const anchor = document.createElement("a");
        anchor.href = link.url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.textContent = link.label;
        item.appendChild(anchor);
        list.appendChild(item);
      });
      links.append(heading, list);
    }
  }

  if (cta) {
    const nextCta = content?.cta;
    cta.hidden = !nextCta?.label || !(nextCta.href ?? nextCta.url);
    if (nextCta?.label && (nextCta.href ?? nextCta.url)) {
      cta.textContent = nextCta.label;
      cta.href = nextCta.href ?? nextCta.url ?? "#";
    }
  }
};

export const createBottomSheetView = (
  runtime: RuntimeInstance,
): BottomSheetView => {
  const root = createElement("section", "g3d-sheet");
  const rail = createElement("header", "g3d-sheet__rail");
  const handle = createElement("button", "g3d-sheet__handle");
  const grip = createElement("span", "g3d-sheet__grip");
  const closeTemplate = document.createElement("template");
  closeTemplate.innerHTML = `
    <button type="button" class="g3d-sheet__close" aria-label="Close content"></button>
  `;
  const close = closeTemplate.content.firstElementChild as HTMLButtonElement;
  const summary = createElement("button", "g3d-sheet__summary");
  const thumb = createElement("img", "g3d-sheet__thumb");
  const summaryCopy = createElement("div", "g3d-sheet__summary-copy");
  const eyebrow = createElement("p", "g3d-sheet__eyebrow");
  const title = createElement("h2", "g3d-sheet__title");
  const subtitle = createElement("p", "g3d-sheet__subtitle");
  const progress = createElement("p", "g3d-sheet__progress");
  const body = createElement("div", "g3d-sheet__body");
  const description = createElement("p", "g3d-sheet__description");
  const sections = createElement("div", "g3d-sheet__sections");
  const links = createElement("section", "g3d-sheet__section g3d-sheet__links");
  const cta = createElement("a", "g3d-sheet__cta");
  let unsubscribe: ContentSurfaceUnsubscribe | null = null;

  root.setAttribute("role", "region");
  root.setAttribute("aria-label", "Gallery details");
  handle.type = "button";
  handle.setAttribute("aria-label", "Toggle content");
  summary.type = "button";
  thumb.loading = "lazy";
  cta.target = "_blank";
  cta.rel = "noopener noreferrer";
  body.hidden = true;
  close.hidden = true;
  thumb.hidden = true;
  subtitle.hidden = true;
  progress.hidden = true;
  links.hidden = true;
  cta.hidden = true;
  handle.append(grip);
  rail.append(handle, close);
  summaryCopy.append(eyebrow, title, subtitle);
  summary.append(thumb, summaryCopy, progress);
  body.append(description, sections, links, cta);
  root.append(rail, summary, body);

  const cycleState = (): void => {
    const current = runtime.getContentSurface().state;
    const next = current === "collapsed" ? "half" : current === "half" ? "full" : "collapsed";
    runtime.setBottomSheetState(next);
  };
  const collapse = (): void => runtime.setBottomSheetState("collapsed");

  handle.addEventListener("click", cycleState);
  summary.addEventListener("click", cycleState);
  close.addEventListener("click", collapse);
  root.addEventListener("dblclick", collapse);
  unsubscribe = runtime.subscribeContentSurface((model) => renderModel(root, model));

  return {
    element: root,
    dispose: () => {
      unsubscribe?.();
      handle.removeEventListener("click", cycleState);
      summary.removeEventListener("click", cycleState);
      close.removeEventListener("click", collapse);
      root.removeEventListener("dblclick", collapse);
      root.remove();
    },
  };
};
