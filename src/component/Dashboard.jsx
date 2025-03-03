import evt from "@/utils/event-handler";
import { useEffect, useState } from "react";
import { WSButton } from "./ui/WSComponents";
import { FaUser } from "react-icons/fa";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [players, setPlayers] = useState([]);

  const onMatchInit = (data) => {
    const presences = data.presences;
    setPlayers(presences);
  };
  const onMatchSync = (data) => {
    const presences = data.presences;
    setPlayers(presences);
  };
  useEffect(() => {
    evt.on("match:init", onMatchInit);
    evt.on("match:sync", onMatchSync);
    return () => {
      evt.off("match:init", onMatchInit);
      evt.off("match:sync", onMatchSync);
    };
  }, []);
  return isOpen ? (
    <div
      onClick={() => setIsOpen(false)}
      className={`
     flex flex-col gap-1
     max-h-[200px] overflow-y-auto
     bg-[var(--color-main-900)]/50
     text-[var(--color-main-100)] text-xs
     p-1.5
     rounded-md 
 `}
    >
      {players
        .sort((a, b) => b.score - a.score)
        .map((player, i) => (
          <div
            key={`player-${i}`}
            className={`
       flex gap-2
     `}
          >
            <div
              className={`
             flex items-center justify-center
             rounded-full
             w-4 h-4
             text-[8px] font-bold
             ${i == 0 && "bg-yellow-500"}
             ${i == 1 && "bg-gray-400"}
             ${i == 2 && "bg-amber-700"}
           `}
            >
              {i + 1}
            </div>
            <div>{player.displayName}</div>
            <div>{player.score || 0}</div>
          </div>
        ))}
    </div>
  ) : (
    <WSButton size="xs" onClick={() => setIsOpen(true)} className={`
      flex gap-0.5
      w-12
      text-xs font-bold
    `}>
      <div className="w-2 h-2 bg-green-300 rounded-full" />
      <FaUser />
      {players.length}
    </WSButton>
  );
};

export default Dashboard;
