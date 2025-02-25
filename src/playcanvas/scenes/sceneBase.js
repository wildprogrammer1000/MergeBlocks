import {
  app,
  Color,
  Entity,
  PROJECTION_ORTHOGRAPHIC,
  StandardMaterial,
  Vec3,
} from "playcanvas";
import { initProjectScene } from "./ProjectScene";
import evt from "@/utils/event-handler";
import { createSoundManager } from "@/gamescripts/SoundManager";

export const initSceneBase = () => {
  // 카메라 설정
  const camera = new Entity("Camera");
  camera.tags.add("MainCamera");
  camera.addComponent("camera", {
    clearColor: new Color(0.9, 0.8, 0.7),
    projection: PROJECTION_ORTHOGRAPHIC,
  });
  camera.setPosition(0, 0, 10);
  const updateClearColor = () => {
    evt.emit("camera:clearColor", camera.camera);
  };
  updateClearColor();
  app.on("asset:applyTheme", updateClearColor);
  app.on("destroy", () => {
    app.off("asset:applyTheme", updateClearColor);
  });
  app.root.addChild(camera);

  // Ground Material
  const groundMaterial = new StandardMaterial();
  groundMaterial.diffuse.set(111 / 255, 78 / 255, 69 / 255);
  groundMaterial.update();
  // 바닥 생성
  const ground = new Entity("Ground");
  ground.addComponent("render", {
    type: "box",
  });
  ground.render.material = groundMaterial;
  ground.setPosition(0, -10, 0);
  ground.setLocalScale(13, 1, 10);
  ground.addComponent("rigidbody", {
    type: "static",
  });
  ground.addComponent("collision", {
    type: "box",
    halfExtents: new Vec3(6.5, 0.5, 5),
  });
  app.root.addChild(ground);

  const wall = new Entity("Wall");
  wall.addComponent("render", {
    type: "box",
  });
  wall.render.material = groundMaterial;
  wall.setPosition(6, 0, 0);
  wall.setLocalScale(1, 20, 5);
  wall.addComponent("collision", {
    type: "box",
    halfExtents: new Vec3(0.5, 12, 2.5),
  });
  wall.addComponent("rigidbody", {
    type: "static",
  });
  app.root.addChild(wall);

  const wall2 = new Entity("Wall2");
  wall2.addComponent("render", {
    type: "box",
  });
  wall2.render.material = groundMaterial;
  wall2.setPosition(-6, 0, 0);
  wall2.setLocalScale(1, 20, 5);
  wall2.addComponent("collision", {
    type: "box",
    halfExtents: new Vec3(0.5, 12, 2.5),
  });
  wall2.addComponent("rigidbody", {
    type: "static",
  });
  app.root.addChild(wall2);

  const light = new Entity("Light");
  light.addComponent("light", {
    type: "directional",
  });
  light.setPosition(0, 0, 0);
  light.setEulerAngles(90, 0, 0);
  app.root.addChild(light);

  createSoundManager(app);

  app.on("game:start", () => {
    initProjectScene();
  });
};
