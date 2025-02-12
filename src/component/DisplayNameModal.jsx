import { useEffect, useRef, useState } from "react";
import evt from "@/utils/event-handler";
import { checkDisplayName, initDisplayName } from "@/api/nakama";
import { FaCheck } from "react-icons/fa";

import { CgSpinner } from "react-icons/cg";
import { BsThreeDots } from "react-icons/bs";

import { useNakama } from "@/providers/NakamaProvider";
const DisplayNameModal = () => {
  const { refreshAccount } = useNakama();
  const checkTimeout = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [checked, setChecked] = useState(false);
  const [checking, setChecking] = useState(false);
  const handleInit = () => {
    setOpen(true);
  };
  const handleChange = (e) => {
    const value =
      e.target.value.length > 16 ? e.target.value.slice(0, 16) : e.target.value;
    setDisplayName(value);
    setChecking(true);
    if (checkTimeout.current) clearTimeout(checkTimeout.current);
    checkTimeout.current = setTimeout(() => check(value), 1000);
  };
  const check = async (value) => {
    setChecking(false);
    if (value.length < 3 || value.length > 16) {
      return;
    }
    const { success } = await checkDisplayName(value);
    setChecked(success);
  };
  const submit = async () => {
    if (checking || !checked || displayName.length === 0) return;
    const { success } = await initDisplayName(displayName);
    if (success) {
      setOpen(false);
      refreshAccount();
    }
  };
  useEffect(() => {
    evt.on("displayname:init", handleInit);
    return () => {
      evt.off("displayname:init", handleInit);
    };
  }, []);
  useEffect(() => {
    setChecked(false);
  }, [displayName]);
  if (!isOpen) return null;
  return (
    <div className="absolute top-0 left-0 z-20 w-full h-full bg-black/50 flex flex-col gap-2 items-center justify-center">
      <div className="bg-white border-2 rounded-2xl">
        <div className="text-xl p-1 font-bold text-center border-b-2">
          SET NICKNAME
        </div>
        <div className="flex flex-col gap-2 p-2">
          <div className="flex gap-2 items-center">
            <input
              value={displayName}
              onChange={handleChange}
              type="text"
              className="p-2 font-bold  bg-gray-200 rounded-2xl"
            />
          </div>
          {displayName.length > 0 ? (
            <button
              onClick={submit}
              className={`flex items-center justify-center p-2 rounded-2xl cursor-pointer ${
                checking ? "" : checked ? "bg-green-400" : "bg-red-400"
              }`}
            >
              {checking ? (
                <div className="text-2xl">
                  <CgSpinner className="animate-spin" />
                </div>
              ) : (
                <div className={`text-2xl  text-white`}>
                  <FaCheck />
                </div>
              )}
            </button>
          ) : (
            <div className="flex items-center justify-center p-2 rounded-2xl   text-2xl">
              <BsThreeDots />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayNameModal;
