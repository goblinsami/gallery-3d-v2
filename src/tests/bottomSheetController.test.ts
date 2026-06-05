import { describe, expect, it } from "vitest";
import type { GalleryItem } from "../types/GalleryItem";
import { BottomSheetController } from "../runtime/BottomSheetController";

const item: GalleryItem = {
  id: "profile-1",
  type: "profile",
  placement: {},
  appearance: {},
  content: {
    eyebrow: "Founder",
    title: "Ari Vale",
    description: "Builder of quiet launch rooms.",
  },
};

describe("BottomSheetController", () => {
  it("projects active item content without knowing item type", () => {
    const controller = new BottomSheetController();
    controller.setActiveItem(item);
    controller.setState("half");

    expect(controller.getModel()).toMatchObject({
      state: "half",
      activeItemId: "profile-1",
      content: {
        title: "Ari Vale",
      },
    });
  });

  it("moves through collapsed, half, and full states", () => {
    const controller = new BottomSheetController();

    controller.expand();
    expect(controller.getModel().state).toBe("half");

    controller.expand();
    expect(controller.getModel().state).toBe("full");

    controller.collapse();
    expect(controller.getModel().state).toBe("half");
  });

  it("notifies subscribers when content changes for the same item id", () => {
    const controller = new BottomSheetController();
    const models = [controller.getModel()];
    const unsubscribe = controller.subscribe((model) => models.push(model));

    controller.setActiveItem(item);
    controller.setActiveItem({
      ...item,
      content: {
        ...item.content,
        title: "Updated title",
      },
    });

    expect(models[models.length - 1].content?.title).toBe("Updated title");
    unsubscribe();
  });
});
