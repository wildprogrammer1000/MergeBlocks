import { WSButton, WSModal, WSModalHeader } from "../ui/WSComponents";
import { IoShareSocialOutline } from "react-icons/io5";
import { VscDebugRestart } from "react-icons/vsc";
import { GoHomeFill } from "react-icons/go";
import { useEffect, useState } from "react";
import evt from "@/utils/event-handler";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { CgSpinner } from "react-icons/cg";

const GameResultModal = ({
  score,
  result = { bestScore: 0, rank: 0 },
  maxCombo,
  loading,
}) => {
  const { t } = useTranslation();
  const [canShare, setCanShare] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Merge Blocks!",
        text: t("SHARE", { score }),
        url: window.location.origin,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const restartGame = () => evt.emit("restart");

  useEffect(() => {
    setCanShare(!!navigator.share);
  }, []);
  return (
    <WSModal className="z-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] bg-[var(--color-main-100)] rounded-2xl">
        <WSModalHeader className="p-2">
          <div className="font-bold text-center w-full">{t("GAME OVER")}</div>
        </WSModalHeader>
        <div className="flex flex-col gap-4 p-4">
          {loading ? (
            <div className="text-center flex justify-center items-center gap-2 font-bold text-[var(--color-main-900)]  text-xl">
              <CgSpinner className="animate-spin" />
              {t("Sending Result")}...
            </div>
          ) : (
            <>
              <div className="flex justify-center gap-4">
                <div className="flex flex-col flex-1 text-xl font-bold text-center bg-[var(--color-main-900)] text-[var(--color-main-100)] p-4 rounded-2xl">
                  <span>{t("Score")}</span>
                  {score}
                </div>
                <div className="flex flex-col flex-1 text-xl font-bold text-center bg-[var(--color-main-900)] text-[var(--color-main-100)] p-4 rounded-2xl">
                  <span>{t("MAX COMBO")}</span>
                  {maxCombo}
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <div className="flex flex-col flex-1 text-xl font-bold text-center bg-[var(--color-main-900)] text-[var(--color-main-100)] p-4 rounded-2xl">
                  <span>{t("BEST SCORE")}</span>
                  {result.bestScore}
                </div>
                <div className="flex flex-col flex-1 text-xl font-bold text-center bg-[var(--color-main-900)] text-[var(--color-main-100)] p-4 rounded-2xl">
                  <span>{t("MY RANK")}</span>
                  {result.rank}
                </div>
              </div>
            </>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex justify-center gap-2 text-2xl font-bold">
              <WSButton onClick={restartGame}>
                <VscDebugRestart />
              </WSButton>
              <WSButton
                onClick={() => setTimeout(() => evt.emit("view:main"), 300)}
              >
                <GoHomeFill />
              </WSButton>
              {canShare && (
                <WSButton onClick={handleShare}>
                  <IoShareSocialOutline />
                </WSButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </WSModal>
  );
};

export default GameResultModal;

GameResultModal.propTypes = {
  score: PropTypes.number.isRequired,
  result: PropTypes.object,
  maxCombo: PropTypes.number,
  loading: PropTypes.bool,
};
