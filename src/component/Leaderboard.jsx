import evt from "@/utils/event-handler";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getRecords } from "@/api/nakama";
import { IoMdClose } from "react-icons/io";
import { FiRefreshCw } from "react-icons/fi";
import { useNakama } from "@/providers/NakamaProvider";
import { FaRegUserCircle } from "react-icons/fa";

const Leaderboard = () => {
  const [records, setRecords] = useState([]);
  const [myRecord, setMyRecord] = useState();

  const [canRefresh, setCanRefresh] = useState(true);
  const [isOpen, setOpen] = useState(false);

  const openLeaderboard = () => setOpen(true);
  const closeLeaderboard = () => setOpen(false);

  const refresh = async () => {
    const { records } = await getRecords();
    setRecords(records.records);

    const [record] = records.ownerRecords;
    setMyRecord(record);
  };
  useEffect(() => {
    evt.on("leaderboard:open", openLeaderboard);
    evt.on("leaderboard:close", closeLeaderboard);
    return () => {
      evt.off("leaderboard:open", openLeaderboard);
      evt.off("leaderboard:close", closeLeaderboard);
    };
  }, []);

  useEffect(() => {
    if (isOpen) refresh();
  }, [isOpen]);

  useEffect(() => {
    if (!canRefresh) {
      setTimeout(() => {
        setCanRefresh(true);
      }, 3000);
    }
  }, [canRefresh]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
      <div className="flex flex-col gap-2 w-full h-full max-h-[80%] max-w-md bg-white p-4 rounded-2xl ">
        <h2 className="text-center text-2xl font-bold">👑 Ranking 👑</h2>
        <div className="flex-1 bg-gray-100 rounded-2xl overflow-y-auto">
          <div className="flex flex-col gap-2 h-full overflow-y-auto p-2">
            {records.length > 0 ? (
              records.map((record, index) => (
                <Record key={`record-${index}`} record={record} />
              ))
            ) : (
              <div className="text-center text-gray-500 font-bold">
                No records...
              </div>
            )}
          </div>
        </div>
        {myRecord && <Record record={myRecord} />}
        <div className="flex gap-2">
          <button
            disabled={!canRefresh}
            className={`flex justify-center items-center flex-1 text-2xl rounded-2xl border-2 border-gray-900 text-gray-900 ${
              canRefresh ? "hover:bg-gray-900 hover:text-white" : ""
            } transition-all duration-300`}
            onClick={() => {
              if (!canRefresh) return;
              setCanRefresh(false);
              refresh();
            }}
          >
            <div className={`${canRefresh ? "" : "animate-spin"} `}>
              <FiRefreshCw />
            </div>
          </button>
          <button
            className="flex justify-center items-center w-12 h-12 text-2xl rounded-2xl border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-all duration-300  "
            onClick={() => evt.emit("leaderboard:close")}
          >
            <IoMdClose />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

const Record = ({ record }) => {
  const { account } = useNakama();
  const colors = {
    1: "bg-yellow-400",
    2: "bg-gray-400",
    3: "bg-amber-700",
  };
  return (
    <div className="px-3 py-3 flex gap-2 items-center border-2 border-gray-900 rounded-full bg-white">
      <div
        className={`w-10 h-10 flex justify-center items-center border-2 rounded-full ${
          colors[record.rank]
        }`}
      >
        <span
          className={`${
            record.rank < 10
              ? "text-[24px]"
              : record.rank < 100
              ? "text-[20px]"
              : record.rank < 1000
              ? "text-[16px]"
              : "text-[14px]"
          }`}
        >
          {record.rank}
        </span>
      </div>
      <div className="flex-1 flex gap-2 items-center">
        <span
          className={`${
            record.metadata.displayName.length < 10
              ? "text-[18px]"
              : record.metadata.displayName.length < 15
              ? "text-[14px]"
              : "text-[12px]"
          }`}
        >
          {record.metadata.displayName}
        </span>
        {account && record.ownerId === account.user.id && (
          <FaRegUserCircle className="" />
        )}
      </div>
      <div className="text-2xl font-bold mr-2">{record.score}</div>
    </div>
  );
};
Record.propTypes = {
  record: PropTypes.shape({
    rank: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    metadata: PropTypes.object.isRequired,
    ownerId: PropTypes.string.isRequired,
  }),
};
