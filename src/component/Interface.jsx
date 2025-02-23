import MainView from "@/views/MainView";
import { useGlobalState } from "@/providers/StateProvider";
import GameView from "@/views/GameView";
import { useEffect, useState } from "react";
import evt from "@/utils/event-handler";
import OutdatedView from "@/views/OutdatedView";
import LoadingView from "@/views/LoadingView";
import main from "@/playcanvas/start";

const Interface = () => {
  const { view, setView } = useGlobalState();
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const showMain = () => setView(0);
  const showGame = () => setView(1);
  const showOutdated = () => setView(2);

  const splashProgress = (progress) => {
    setProgress(progress);
    if (progress === 1) {
      setTimeout(() => {
        setLoaded(true);
      }, 1000);
    }
  };
  useEffect(() => {
    evt.on("splash:progress", splashProgress);
    evt.on("view:game", showGame);
    evt.on("view:main", showMain);
    evt.on("view:outdated", showOutdated);
    return () => {
      evt.off("splash:progress", splashProgress);
      evt.off("view:game", showGame);
      evt.off("view:main", showMain);
      evt.off("view:outdated", showOutdated);
    };
  }, []);

  useEffect(() => {
    if (view === 0) {
      setLoaded(false);
      main();
    }
  }, [view]);
  return loaded ? (
    <>
      {view === 0 && <MainView />}
      {view === 1 && <GameView />}
      {view === 2 && <OutdatedView />}
    </>
  ) : (
    <LoadingView progress={progress} />
  );
};

export default Interface;
