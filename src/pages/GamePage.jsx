import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createGameManager } from "@/gamescripts/GameManager";
import { createInputHandler } from "@/gamescripts/InputHandler";
import * as pc from "playcanvas";
import { createDeadline } from "@/templates/Deadline";
import { GoHome } from "react-icons/go";
import { addRecord } from "@/api/nakama";
import { VscDebugRestart } from "react-icons/vsc";
import { levels } from "@/assets/json/block_levels.js";
import { IoShareSocialOutline } from "react-icons/io5";

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
  const [canShare, setCanShare] = useState(false);

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
      texture1: new pc.Asset("chocolate_0", "texture", {
        url: new URL(
          "../assets/chocolate/chocolate_0.png",
          import.meta.url
        ).toString(),
      }),
      texture2: new pc.Asset("chocolate_1", "texture", {
        url: new URL(
          "../assets/chocolate/chocolate_1.png",
          import.meta.url
        ).toString(),
      }),
      texture3: new pc.Asset("chocolate_2", "texture", {
        url: new URL(
          "../assets/chocolate/chocolate_2.png",
          import.meta.url
        ).toString(),
      }),
      texture4: new pc.Asset("chocolate_3", "texture", {
        url: new URL(
          "../assets/chocolate/chocolate_3.png",
          import.meta.url
        ).toString(),
      }),
      texture5: new pc.Asset("chocolate_4", "texture", {
        url: new URL(
          "../assets/chocolate/chocolate_4.png",
          import.meta.url
        ).toString(),
      }),
      texture6: new pc.Asset("chocolate_5", "texture", {
        url: new URL(
          "../assets/chocolate/chocolate_5.png",
          import.meta.url
        ).toString(),
      }),
      texture7: new pc.Asset("chocolate_6", "texture", {
        url: new URL(
          "../assets/chocolate/chocolate_6.png",
          import.meta.url
        ).toString(),
      }),
      texture8: new pc.Asset("chocolate_7", "texture", {
        url: new URL(
          "../assets/chocolate/chocolate_7.png",
          import.meta.url
        ).toString(),
      }),
      texture9: new pc.Asset("chocolate_8", "texture", {
        url: new URL(
          "../assets/chocolate/chocolate_8.png",
          import.meta.url
        ).toString(),
      }),
      texture10: new pc.Asset("chocolate_9", "texture", {
        url: new URL(
          "../assets/chocolate/chocolate_9.png",
          import.meta.url
        ).toString(),
      }),
      texture11: new pc.Asset("chocolate_10", "texture", {
        url: new URL(
          "../assets/chocolate/chocolate_10.png",
          import.meta.url
        ).toString(),
      }),
    };

    const assetLoader = new pc.AssetListLoader(
      Object.values(assets),
      app.assets
    );
    assetLoader.load(() => {
      app.start();

      // 레벨별 스프라이트 미리 생성
      levels.forEach((_, index) => {
        const textureAsset = app.assets.find(`chocolate_${index}`);
        const atlas = new pc.TextureAtlas();

        atlas.frames = {
          1: {
            rect: new pc.Vec4(
              0,
              0,
              textureAsset.resource.width,
              textureAsset.resource.height
            ),
            pivot: new pc.Vec2(0.5, 0.5),
            border: new pc.Vec4(0, 0, 0, 0),
          },
        };
        atlas.texture = textureAsset.resource;

        const sprite = new pc.Sprite(app.graphicsDevice, {
          atlas: atlas,
          frameKeys: [1],
          pixelsPerUnit: 512, // Block 클래스의 textureSize와 동일한 값
          renderMode: pc.SPRITE_RENDERMODE_SIMPLE,
        });

        const spriteAsset = new pc.Asset(`level_${index}`, "sprite", {
          url: "",
        });
        spriteAsset.resource = sprite;
        spriteAsset.loaded = true;
        app.assets.add(spriteAsset);
      });

      createGameManager(app);
      createInputHandler(app);
      createDeadline(app);
      // 카메라 설정
      const camera = new pc.Entity("Camera");
      camera.tags.add("MainCamera");
      camera.addComponent("camera", {
        clearColor: new pc.Color(0.9, 0.8, 0.7),
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

  useEffect(() => {
    setCanShare(!!navigator.share);
  }, []);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Merge Blocks!",
        text: `I scored ${score} points! Can you beat my score?`,
        url: window.location.origin,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

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
        <div className="absolute top-0 left-0 z-20 w-full h-full bg-black/50 flex flex-col gap-2 items-center justify-center">
          <div className="text-4xl font-bold text-white">GAME OVER</div>
          <div className="text-2xl font-bold text-white">SCORE: {score}</div>
          {result && (
            <div className="text-2xl font-bold text-white text-center">
              BEST SCORE: {result.bestScore} <br />
              My Rank: {result.rank}
            </div>
          )}
          <div className="flex gap-2 text-2xl font-bold text-white">
            <button
              className="w-16 h-16 flex justify-center items-center text-4xl bg-[var(--color-chocolate-100)] text-[var(--color-chocolate-900)] px-4 py-2 rounded-2xl hover:bg-[var(--color-chocolate-900)] hover:text-[var(--color-chocolate-100)] transition-all duration-300 hover:border-white "
              onClick={restartGame}
            >
              <VscDebugRestart />
            </button>
            <Link
              className="w-16 h-16 flex justify-center items-center text-4xl bg-[var(--color-chocolate-100)] text-[var(--color-chocolate-900)] px-4 py-2 rounded-2xl hover:bg-[var(--color-chocolate-900)] hover:text-[var(--color-chocolate-100)] transition-all duration-300 hover:border-white "
              to="/"
            >
              <GoHome />
            </Link>
            {canShare && (
              <button
                className={`w-16 h-16 flex justify-center items-center text-4xl bg-white text-black px-4 py-2 rounded-md transition-all duration-300 border-2 ${
                  canShare
                    ? "hover:bg-black hover:text-white hover:border-white border-black"
                    : "opacity-50 cursor-not-allowed border-gray-400"
                }`}
                onClick={handleShare}
              >
                <IoShareSocialOutline />
              </button>
            )}
          </div>
        </div>
      )}
      <div className="absolute top-4 left-4 z-10 text-2xl font-bold text-[var(--color-chocolate-100)] bg-[var(--color-chocolate-900)]/50 px-4 py-2 rounded-2xl">
        SCORE: {score}
      </div>

      <Link
        to="/"
        className="absolute top-4 right-4 z-10 bg-[var(--color-chocolate-900)] text-[var(--color-chocolate-100)] hover:bg-[var(--color-chocolate-100)] hover:text-[var(--color-chocolate-900)] rounded-2xl  transition-all duration-300 w-12 h-12 flex justify-center items-center text-3xl "
      >
        <GoHome />
      </Link>
      <canvas className="select-none" ref={canvasRef} />
    </div>
  );
}

export default GamePage;
