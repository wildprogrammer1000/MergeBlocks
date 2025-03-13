import evt from "@/utils/event-handler";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getRecords } from "@/api/rpc";
import { IoMdClose } from "react-icons/io";
import { FiRefreshCw } from "react-icons/fi";
import { useNakama } from "@/providers/NakamaProvider";
import { FaRegUserCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { WSButton } from "./ui/WSComponents";

const Leaderboard = () => {
  const { t } = useTranslation();
  const [records, setRecords] = useState([]);
  const [myRecord, setMyRecord] = useState();

  const [canRefresh, setCanRefresh] = useState(true);
  const [isOpen, setOpen] = useState(false);

  const openLeaderboard = () => setOpen(true);
  const closeLeaderboard = () => setOpen(false);

  const refresh = async () => {
    const { records } = await getRecords();
    if (records && records.records) {
      setRecords(records.records);

      const [record] = records.ownerRecords;
      setMyRecord(record);
    }
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
    <div
      className="fixed inset-0 z-10 bg-[rgba(0,0,0,0.5)] flex justify-center items-center"
      onClick={() => evt.emit("leaderboard:close")}
    >
      <div
        className="flex flex-col w-full h-full max-h-[80%] max-w-md rounded-3xl bg-[var(--color-main-100)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center font-bold text-[var(--color-main-900)] border-b-2 p-4">
          👑 {t("Ranking")} 👑
        </h2>
        <div className="flex-1 rounded-2xl overflow-y-auto">
          <div className="flex flex-col gap-2 h-full overflow-y-auto p-2">
            {records.length > 0 ? (
              records.map((record, index) => (
                <Record key={`record-${index}`} record={record} />
              ))
            ) : (
              <div className="text-center text-[var(--color-main-100)] font-bold">
                {t("No Records")}...
              </div>
            )}
          </div>
        </div>
        {myRecord && (
          <div className="p-2 border-y-2 border-[var(--color-main-900)]">
            <Record record={myRecord} />
          </div>
        )}
        <div className="flex gap-2 p-2">
          <button
            disabled={!canRefresh}
            className={`flex justify-center items-center flex-1 rounded-2xl border-2 bg-[var(--color-main-100)] text-[var(--color-main-900)] ${
              canRefresh
                ? "hover:bg-[var(--color-main-900)] hover:text-[var(--color-main-100)]"
                : ""
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
          <WSButton
            type="close"
            className="border-red-400 hover:border-red-400 text-[var(--color-main-100)] bg-red-400 hover:bg-[var(--color-main-900)"
            onClick={() => evt.emit("leaderboard:close")}
          >
            <IoMdClose />
          </WSButton>
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
    <div className="px-3 py-3 flex gap-2 items-center  rounded-2xl bg-[var(--color-main-700)] text-[var(--color-main-100)]">
      <div
        className={`w-10 h-10 flex justify-center items-center border-[var(--color-main-900)] rounded-full ${
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
          className={`font-bold ${
            record.metadata.displayName.length < 10
              ? "text-[18px]"
              : record.metadata.displayName.length < 15
              ? "text-[14px]"
              : "text-[12px]"
          }`}
        >
          {record.metadata.displayName}
        </span>
        {account && record.ownerId === account.user.id && <FaRegUserCircle />}
      </div>
      <div className="text-xl font-bold mr-2">{record.score}</div>
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
