import { app, Color, Entity, PROJECTION_ORTHOGRAPHIC, Vec3 } from "playcanvas";

export const initSceneBase = () => {
  // 카메라 설정
  const camera = new Entity("Camera");
  camera.tags.add("MainCamera");
  camera.addComponent("camera", {
    clearColor: new Color(0.9, 0.8, 0.7),
    projection: PROJECTION_ORTHOGRAPHIC,
  });
  camera.setPosition(0, 0, 10);
  app.root.addChild(camera);

  // Deadline

  // 바닥 생성
  const ground = new Entity("Ground");
  ground.addComponent("model", {
    type: "box",
  });
  ground.setPosition(0, -10, 0);
  ground.setLocalScale(10, 0.5, 10);
  ground.addComponent("rigidbody", {
    type: "static",
    restitution: 0,
  });
  ground.addComponent("collision", {
    type: "box",
    halfExtents: new Vec3(5, 0.25, 5),
  });
  app.root.addChild(ground);

  const wall = new Entity("Wall");
  wall.addComponent("model", {
    type: "box",
  });
  wall.setPosition(5, 0, 0);
  wall.setLocalScale(0.3, 20, 5);
  wall.addComponent("collision", {
    type: "box",
    halfExtents: new Vec3(0.15, 10, 2.5),
  });
  wall.addComponent("rigidbody", {
    type: "static",
    restitution: 0,
  });
  app.root.addChild(wall);

  const wall2 = new Entity("Wall2");
  wall2.addComponent("model", {
    type: "box",
  });
  wall2.setPosition(-5, 0, 0);
  wall2.setLocalScale(0.3, 20, 1);
  wall2.addComponent("collision", {
    type: "box",
    halfExtents: new Vec3(0.15, 10, 0.05),
  });
  wall2.addComponent("rigidbody", {
    type: "static",
    restitution: 0,
  });
  app.root.addChild(wall2);

  const light = new Entity("Light");
  light.addComponent("light", {
    type: "directional",
  });
  light.setPosition(0, 0, 0);
  light.setEulerAngles(90, 0, 0);
  app.root.addChild(light);
};
