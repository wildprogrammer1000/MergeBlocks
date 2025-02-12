import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createGameManager } from "@/scripts/GameManager";
import { createInputHandler } from "@/scripts/InputHandler";
import * as pc from "playcanvas";
import { createDeadline } from "@/templates/Deadline";
import { GoHome } from "react-icons/go";
import { addRecord } from "@/api/nakama";

if (import.meta.env.DEV) window.pc = pc;

pc.WasmModule.setConfig("Ammo", {
  glueUrl: "modules/ammo/ammo.wasm.js",
  wasmUrl: "modules/ammo/ammo.wasm.wasm",
  fallbackUrl: "modules/ammo/ammo.js",
});
pc.WasmModule.getInstance("Ammo", () => {});

// window.Ammo = Ammo;
window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

function GamePage() {
  const scoreRef = useRef(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [result, setResult] = useState(null);

  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const updateScore = (level) => {

    if (gameOver) return;
    scoreRef.current += (level + 1) * (level + 2) * 0.5;
    setScore(scoreRef.current);
  };
  const onGameOver = async () => {
    const { records } = await addRecord(scoreRef.current);
    const ownerRecord = records.ownerRecords[0];
    const rank = ownerRecord.rank;
    const bestScore = ownerRecord.score;
    setResult({
      rank,
      bestScore,
    });
    setGameOver(true);
  };
  const onCountdown = (time) => {
    setCountdown(time.toFixed(2));
  };
  const restartGame = () => {
    appRef.current.fire("game:restart");
    scoreRef.current = 0;
    setScore(scoreRef.current);
    setGameOver(false);
    setResult(null);
  };
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
      createDeadline(app);
      // 카메라 설정
      const camera = new pc.Entity("Camera");
      camera.tags.add("MainCamera");
      camera.addComponent("camera", {
        clearColor: new pc.Color(0.1, 0.1, 0.1),
        projection: pc.PROJECTION_ORTHOGRAPHIC,
      });
      camera.setPosition(0, 0, 10);
      app.root.addChild(camera);

      // Deadline

      // 바닥 생성
      const ground = new pc.Entity("Ground");
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
        halfExtents: new pc.Vec3(5, 0.25, 5),
      });
      app.root.addChild(ground);

      const wall = new pc.Entity("Wall");
      wall.addComponent("model", {
        type: "box",
      });
      wall.setPosition(5, 0, 0);
      wall.setLocalScale(0.3, 20, 5);
      wall.addComponent("collision", {
        type: "box",
        halfExtents: new pc.Vec3(0.15, 10, 2.5),
      });
      wall.addComponent("rigidbody", {
        type: "static",
        restitution: 0,
      });
      app.root.addChild(wall);

      const wall2 = new pc.Entity("Wall2");
      wall2.addComponent("model", {
        type: "box",
      });
      wall2.setPosition(-5, 0, 0);
      wall2.setLocalScale(0.3, 20, 1);
      wall2.addComponent("collision", {
        type: "box",
        halfExtents: new pc.Vec3(0.15, 10, 0.05),
      });
      wall2.addComponent("rigidbody", {
        type: "static",
        restitution: 0,
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
      appRef.current.resizeCanvas();
    });
    app.resizeCanvas();

    // 앱 참조 저장
    appRef.current = app;

    app.on("score:get", updateScore);
    app.on("game:over", onGameOver);
    app.on("game:countdown", onCountdown);
    // 클린업 함수
    return () => {
      if (appRef.current) {
        appRef.current.off("score:get", updateScore);
        appRef.current.off("game:over", onGameOver);
        appRef.current.off("game:countdown", onCountdown);
        window.removeEventListener("resize", appRef.current.resizeCanvas);
        appRef.current.destroy();
      }
    };
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  return (
    <div className="game-page">
      {countdown > 0 && (
        <div className="absolute top-0 left-0 z-20 w-full h-full  flex flex-col items-center justify-center pointer-events-none">
          <div
            className={`text-[64px] font-bold ${
              parseInt(countdown) < 3 ? "text-red-400" : "text-white"
            } `}
          >
            {countdown}
          </div>
        </div>
      )}
      {gameOver && (
        <div className="absolute top-0 left-0 z-20 w-full h-full bg-black/50 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-white">GAME OVER</div>
          <div className="text-2xl font-bold text-white">SCORE: {score}</div>
          {result && (
            <div className="text-2xl font-bold text-white text-center">
              BEST SCORE: {result.bestScore} <br />
              My Rank: {result.rank}
            </div>
          )}
          <div className="text-2xl font-bold text-white">
            <button
              className="bg-white text-black px-4 py-2 rounded-md hover:bg-black hover:text-white transition-all duration-300 hover:border-white border-2 border-black"
              onClick={restartGame}
            >
              RESTART
            </button>
          </div>
        </div>
      )}
      <div className="absolute top-4 left-4 z-10 text-2xl font-bold text-white">
        SCORE: {score}
      </div>

      <Link
        to="/"
        className="absolute top-4 right-4 z-10 bg-white border border-black rounded-md hover:bg-black hover:text-white transition-all duration-300 w-12 h-12 flex justify-center items-center text-3xl"
      >
        <GoHome />
      </Link>
      <canvas className="select-none" ref={canvasRef} />
    </div>
  );
}

export default GamePage;
