import { findMatch } from "@/api/rpc";
import { DECODER, OP_CODE } from "@/constants/variables";
import { useNakama } from "@/providers/NakamaProvider";
import evt from "@/utils/event-handler";
import { useEffect, useState } from "react";

const MatchHandler = () => {
  const { socket } = useNakama();
  const [matchId, setMatchId] = useState(null);

  const initialize = async () => {
    try {
      // Match
      const foundMatch = await findMatch("mergeblocks");
      await socket.joinMatch(foundMatch.matchId);
      setMatchId(foundMatch.matchId);
    } catch (err) {
      console.error("failed to join match: ", err);
    }
  };

  const onMatchData = (matchData) => {
    const opCode = matchData.op_code;
    const data = matchData.data;
    const decodedData = data ? JSON.parse(DECODER.decode(data)) : null;

    switch (opCode) {
      case OP_CODE.MATCH_INIT:
        evt.emit("match:init", decodedData);
        break;
      case OP_CODE.MATCH_SYNC:
        evt.emit("match:sync", decodedData);
        break;
    }
  };
  const onUpdateScore = (data) => {
    try {
      if (!matchId || !socket || !socket?.adapter?.isOpen()) return;
      socket.sendMatchState(
        matchId,
        OP_CODE.PLAYER_UPDATE_SCORE,
        JSON.stringify(data)
      );
    } catch (err) {
      console.error("failed to send score: ", err);
    }
  };
  useEffect(() => {
    evt.on("matchdata", onMatchData);
    evt.on("player:update_score", onUpdateScore);
    return () => {
      evt.off("matchdata", onMatchData);
      evt.off("player:update_score", onUpdateScore);
    };
  }, [socket, matchId]);

  useEffect(() => {
    socket && initialize();
  }, [socket]);
  return null;
};

export default MatchHandler;
