import MainView from "@/views/MainView";
import { useGlobalState } from "@/providers/StateProvider";
import GameView from "@/views/GameView";
import { useEffect } from "react";
import evt from "@/utils/event-handler";
import OutdatedView from "@/views/OutdatedView";

const Interface = () => {
  const { view, setView } = useGlobalState();
  const showMain = () => setView(0);
  const showGame = () => setView(1);
  const showOutdated = () => setView(2);
  useEffect(() => {
    evt.on("view:game", showGame);
    evt.on("view:main", showMain);
    evt.on("view:outdated", showOutdated);
    return () => {
      evt.off("view:game", showGame);
      evt.off("view:main", showMain);
      evt.off("view:outdated", showOutdated);
    };
  }, []);
  return (
    <>
      {view === 0 && <MainView />}
      {view === 1 && <GameView />}
      {view === 2 && <OutdatedView />}
    </>
  );
};

export default Interface;
