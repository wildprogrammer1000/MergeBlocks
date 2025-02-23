import evt from "@/utils/event-handler";
import Leaderboard from "@/component/Leaderboard";
import { FaPlay, FaUser } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { useNakama } from "@/providers/NakamaProvider";
import DisplayNameModal from "@/component/modal/DisplayNameModal";
import Profile from "@/component/Profile";
import { useEffect, useRef, useState } from "react";
import { MdEvent } from "react-icons/md";
import { WSButton } from "@/component/ui/WSComponents";
import Header from "@/component/layout/Header";
import EventsModal from "@/component/EventsModal";
import CacheController from "@/component/CacheController";
import Version from "@/component/ui/Version";
import { app } from "playcanvas";
import main from "@/playcanvas/start";

function MainPage() {
  const pageRef = useRef(null);
  const { account } = useNakama();
  const [isSupportedBrowser, setIsSupportedBrowser] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    // 인앱 브라우저 체크
    const isInApp = /kakaotalk|line|instagram|facebook|naver|band/i.test(
      userAgent
    );

    setIsSupportedBrowser(!isInApp);

    const handlePWAOutdated = () => pageRef.current.remove();

    evt.on("version:pwa-outdated", handlePWAOutdated);

    return () => {
      evt.off("version:pwa-outdated", handlePWAOutdated);
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className="absolute w-full h-full flex flex-col justify-center items-center gap-4 bg-[var(--color-background)]"
    >
      <Header />
      <h1 className="text-[80px] font-bold text-center leading-none text-[var(--color-chocolate-900)]">
        MERGE
        <br />
        BLOCKS
      </h1>
      {account && (
        <div className="flex justify-center items-center gap-4 flex-col">
          <WSButton
            className="w-24 h-24 text-[60px] rounded-4xl"
            onClick={() => {
              account.user.display_name
                ? app.fire("game:start")
                : evt.emit("displayname:init");
            }}
          >
            <FaPlay />
          </WSButton>
          <div className="flex gap-4">
            {account && (
              <WSButton
                onClick={() => {
                  if (isSupportedBrowser) {
                    evt.emit("profile:open");
                  } else {
                    alert(
                      "This feature is not supported in in-app browsers.\nPlease use browsers\n(Chrome , Safari, etc.)"
                    );
                  }
                }}
              >
                <FaUser />
              </WSButton>
            )}
            <WSButton onClick={() => evt.emit("events")}>
              <MdEvent />
            </WSButton>
            <WSButton onClick={() => evt.emit("leaderboard:open")}>
              <MdLeaderboard />
            </WSButton>
          </div>
        </div>
      )}

      {/* <Chat /> */}
      <Profile />
      <Leaderboard />
      <DisplayNameModal />
      <EventsModal />
      <CacheController />
      <Version />
    </div>
  );
}

export default MainPage;
