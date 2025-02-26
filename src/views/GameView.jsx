import { app } from "playcanvas";
import { useEffect, useRef, useState } from "react";

import { addRecord } from "@/api/nakama";
import { useNakama } from "@/providers/NakamaProvider";
import { FaPause } from "react-icons/fa6";
import { WSButton } from "@/component/ui/WSComponents";
import { BiLogoZoom } from "react-icons/bi";
import { IoMdHelp } from "react-icons/io";
import evt from "@/utils/event-handler";
import PauseModal from "@/component/modal/PauseModal";
import HelpModal from "@/component/modal/HelpModal";
// import WalletPoint from "@/component/ui/WalletPoint";
import Version from "@/component/ui/Version";
import CacheController from "@/component/CacheController";
import GameResultModal from "@/component/modal/GameResultModal";
import { useTranslation } from "react-i18next";

const GamePage = () => {
  const { t } = useTranslation();
  const pageRef = useRef(null);
  const { refreshAccount } = useNakama();
  const scoreRef = useRef(0);
  const pointRef = useRef(0);
  const maxComboRef = useRef(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  // const [point, setPoint] = useState(0);
  const [pointCombo, setPointCombo] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [result, setResult] = useState({
    bestScore: 0,
    rank: 0,
  });

  const updateScore = ({ score, point, pointCombo }) => {
    if (gameOver) return;
    scoreRef.current = score;
    pointRef.current = point;
    maxComboRef.current = Math.max(maxComboRef.current, pointCombo);
    setMaxCombo(maxComboRef.current);
    setPointCombo(pointCombo);
    setScore(scoreRef.current);
    // setPoint(pointRef.current);
  };
  const updatePoint = (point) => {
    if (gameOver) return;
    pointRef.current = point;
    // setPoint(pointRef.current);
  };
  const onGameOver = async () => {
    const { records } = await addRecord({
      score: scoreRef.current,
      point: pointRef.current,
    });
    const ownerRecord = records.ownerRecords[0];
    const rank = ownerRecord.rank;
    const bestScore = ownerRecord.score;
    setResult({
      rank,
      bestScore,
    });
    setGameOver(true);
    await refreshAccount();
  };
  const onCountdown = (time) => {
    setCountdown(time.toFixed(2));
  };
  const restartGame = () => {
    app.fire("game:restart");
    scoreRef.current = 0;
    pointRef.current = 0;
    maxComboRef.current = 0;
    setPointCombo(0);
    setMaxCombo(0);
    setScore(scoreRef.current);
    // setPoint(pointRef.current);
    setGameOver(false);
    setResult({
      bestScore: 0,
      rank: 0,
    });
  };

  useEffect(() => {
    app.on("score:update", updateScore);
    app.on("point:update", updatePoint);
    app.on("game:over", onGameOver);
    app.on("game:countdown", onCountdown);
    const handlePWAOutdated = () => pageRef.current.remove();

    evt.on("restart", restartGame);
    evt.on("version:pwa-outdated", handlePWAOutdated);

    return () => {
      evt.off("version:pwa-outdated", handlePWAOutdated);
      evt.off("restart", restartGame);
      if (app) {
        app.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (gameOver) app.fire("sound:play", "gameover");
    if (app) app.on("score:update", updateScore);

    return () => {
      if (app) app.off("score:update", updateScore);
    };
  }, [gameOver]);
  return (
    <div>
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
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="font-bold text-[var(--color-main-900)] bg-[var(--color-main-300)]/80 px-4 py-2 rounded-full">
          {t("Score")}: {score}
        </div>
        {/* <WalletPoint
          type="point"
          value={point}
          className="w-fit  bg-[var(--color-main-900)]/80"
        /> */}
        {pointCombo > 0 && (
          <i className="text-[var(--color-main-900)] font-bold text-xl">
            {pointCombo} {t("Combo")}!
          </i>
        )}
      </div>

      <div className="absolute top-4 right-4 flex gap-2 ">
        <WSButton onClick={() => app.fire("game:view")}>
          <BiLogoZoom />
        </WSButton>
        <WSButton onClick={() => evt.emit("help")}>
          <IoMdHelp />
        </WSButton>
        <WSButton onClick={() => evt.emit("pause")}>
          <FaPause />
        </WSButton>
      </div>
      <PauseModal />
      <HelpModal />
      <CacheController />

      {/* Version */}
      <Version visible={false} />
      {gameOver && (
        <GameResultModal score={score} result={result} maxCombo={maxCombo} />
      )}
    </div>
  );
};

export default GamePage;
