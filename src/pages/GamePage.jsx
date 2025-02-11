import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createGameManager } from "@/scripts/GameManager";
import { createInputHandler } from "@/scripts/InputHandler";
import * as pc from "playcanvas";
import * as Ammo from "ammo.js";

if (import.meta.env.DEV) window.pc = pc;

window.Ammo = Ammo;
window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

function GamePage() {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Ammo 초기화
    // PlayCanvas 앱 초기화
    const canvas = canvasRef.current;

    const app = new pc.Application(canvas, {
      mouse: pc.platform.desktop ? new pc.Mouse(canvas) : null,
      keyboard: new pc.Keyboard(window),
      touch: pc.platform.desktop ? null : new pc.TouchDevice(canvas),
    });

    app.graphicsDevice.maxPixelRatio = Math.min(window.devicePixelRatio, 2);

    // 캔버스 크기 설정
    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);
    const assets = {
      texture: new pc.Asset("cat", "texture", {
        url: new URL("../assets/Ellipse.png", import.meta.url).toString(),
      }),
    };

    const assetLoader = new pc.AssetListLoader(
      Object.values(assets),
      app.assets
    );
    assetLoader.load(() => {
      app.start();

      createGameManager(app);
      createInputHandler(app);
      // 카메라 설정
      const camera = new pc.Entity("Camera");
      camera.tags.add("MainCamera");
      camera.addComponent("camera", {
        clearColor: new pc.Color(0.1, 0.1, 0.1),
        projection: pc.PROJECTION_ORTHOGRAPHIC,
      });
      camera.setPosition(0, 0, 10);
      app.root.addChild(camera);

      // 바닥 생성
      const ground = new pc.Entity("Ground");
      ground.addComponent("model", {
        type: "box",
      });
      ground.setPosition(0, -8, 0);
      ground.setLocalScale(10, 0.1, 10);
      ground.addComponent("rigidbody", {
        type: "static",
        restitution: 0.5,
      });
      ground.addComponent("collision", {
        type: "box",
        halfExtents: new pc.Vec3(5, 0.05, 5),
      });
      app.root.addChild(ground);

      const wall = new pc.Entity("Wall");
      wall.addComponent("model", {
        type: "box",
      });
      wall.setPosition(5, 0, 0);
      wall.setLocalScale(0.1, 16, 5);
      wall.addComponent("collision", {
        type: "box",
        halfExtents: new pc.Vec3(0.05, 8, 2.5),
      });
      wall.addComponent("rigidbody", {
        type: "static",
        restitution: 0.5,
      });
      app.root.addChild(wall);

      const wall2 = new pc.Entity("Wall2");
      wall2.addComponent("model", {
        type: "box",
      });
      wall2.setPosition(-5, 0, 0);
      wall2.setLocalScale(0.1, 16, 1);
      wall2.addComponent("collision", {
        type: "box",
        halfExtents: new pc.Vec3(0.05, 8, 0.05),
      });
      wall2.addComponent("rigidbody", {
        type: "static",
        restitution: 0.5,
      });
      app.root.addChild(wall2);

      const light = new pc.Entity("Light");
      light.addComponent("light", {
        type: "directional",
      });
      light.setPosition(0, 0, 0);
      light.setEulerAngles(90, 0, 0);
      app.root.addChild(light);
    });
    window.addEventListener("resize", () => {
      app.resizeCanvas();
    });
    app.resizeCanvas();

    // 앱 참조 저장
    appRef.current = app;

    // 클린업 함수
    return () => {
      if (appRef.current) {
        window.removeEventListener("resize", app.resizeCanvas);
        appRef.current.destroy();
      }
    };
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  return (
    <div className="game-page">
      <canvas ref={canvasRef} />
      <Link
        to="/"
        className="absolute top-4 left-4 z-10 bg-white border border-black px-4 py-2 rounded-md hover:bg-black hover:text-white transition-all duration-300"
      >
        Home
      </Link>
    </div>
  );
}

export default GamePage;
