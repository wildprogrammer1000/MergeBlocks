import {
  Entity,
  EVENT_MOUSEDOWN,
  EVENT_MOUSEMOVE,
  EVENT_MOUSEUP,
  EVENT_TOUCHSTART,
  EVENT_TOUCHMOVE,
  EVENT_TOUCHEND,
  Script,
} from "playcanvas";

class InputHandler extends Script {
  initialize() {
    this.isDragging = false;
    if (this.app.touch) {
      this.app.touch.on(EVENT_TOUCHSTART, this.onTouchStart, this);
      this.app.touch.on(EVENT_TOUCHMOVE, this.onTouchMove, this);
      this.app.touch.on(EVENT_TOUCHEND, this.onTouchEnd, this);
    }
    if (this.app.mouse) {
      this.app.mouse.on(EVENT_MOUSEDOWN, this.onMouseDown, this);
      this.app.mouse.on(EVENT_MOUSEMOVE, this.onMouseMove, this);
      this.app.mouse.on(EVENT_MOUSEUP, this.onMouseUp, this);
    }
  }

  isUIElement(event) {
    const target = event.element;
    return target.id !== "app-canvas";
  }

  onMouseDown(event) {
    if (this.isUIElement(event)) return;

    this.isDragging = true;
    const point = this.screenToWorld(event.x, event.y);
    this.app.fire("pointer:down", { x: point.x, y: point.y });
  }

  onMouseMove(event) {
    if (this.isUIElement(event)) return;
    if (!this.isDragging) return;

    const point = this.screenToWorld(event.x, event.y);
    this.app.fire("pointer:move", { x: point.x, y: point.y });
  }

  onMouseUp(event) {
    if (this.isUIElement(event)) return;
    if (!this.isDragging) return;

    this.isDragging = false;
    const point = this.screenToWorld(event.x, event.y);
    this.app.fire("pointer:up", { x: point.x, y: point.y });
  }

  onTouchStart(event) {
    if (this.isUIElement(event)) return;

    this.isDragging = true;
    const touch = event.touches[0];
    const point = this.screenToWorld(touch.x, touch.y);
    this.app.fire("pointer:down", { x: point.x, y: point.y });
  }

  onTouchMove(event) {
    if (this.isUIElement(event)) return;
    if (!this.isDragging) return;

    const touch = event.touches[0];
    const point = this.screenToWorld(touch.x, touch.y);
    this.app.fire("pointer:move", { x: point.x, y: point.y });
  }

  onTouchEnd(event) {
    if (this.isUIElement(event)) return;
    if (!this.isDragging) return;

    this.isDragging = false;
    const touch = event.changedTouches[0];
    if (touch) {
      const point = this.screenToWorld(touch.x, touch.y);
      this.app.fire("pointer:up", { x: point.x, y: point.y });
    }
  }

  screenToWorld(x, y) {
    const camera = this.app.root.findByTag("MainCamera")[0];
    if (!camera) {
      console.error("Camera not found");
      return;
    }
    const point = camera.camera.screenToWorld(x, y, 0);
    return point;
  }
}

export const createInputHandler = (app) => {
  const entity = new Entity("InputHandler", app);
  entity.addComponent("script");
  entity.script.create(InputHandler);
  app.root.addChild(entity);
};
