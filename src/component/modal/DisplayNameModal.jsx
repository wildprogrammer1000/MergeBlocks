import { useEffect, useRef, useState } from "react";
import evt from "@/utils/event-handler";
import { checkDisplayName, initDisplayName } from "@/api/nakama";
import { FaCheck } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";
import { BsThreeDots } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { useNakama } from "@/providers/NakamaProvider";
import { WSButton, WSModal, WSModalHeader } from "../ui/WSComponents";

const DisplayNameModal = () => {
  const { t } = useTranslation();
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
    <WSModal onClick={() => setOpen(false)}>
      <div onClick={(e) => e.stopPropagation()}>
        <WSModalHeader className="flex w-full p-2">
          <div className="text-xl font-bold">{t("SET NICKNAME")}</div>
        </WSModalHeader>
        <div className="flex flex-col gap-1 p-4">
          <div className="text-[var(--color-main-900)] font-bold">
            {t("Nickname")}
          </div>
          <div className="flex gap-2">
            <div className="flex-1 relative flex gap-2 items-center">
              <input
                type="text"
                value={displayName}
                onChange={handleChange}
                className="w-full p-2 border-2 border-[var(--color-main-900)] rounded-xl focus:border-[var(--color-main-500)] outline-none text-[var(--color-main-900)] font-bold"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center">
                {displayName.length > 0 ? (
                  checking ? (
                    <CgSpinner className="animate-spin text-2xl text-main-900" />
                  ) : (
                    <FaCheck
                      className={`text-2xl ${
                        checked ? "text-green-500" : "text-red-500"
                      }`}
                    />
                  )
                ) : (
                  <BsThreeDots className="text-2xl text-main-900" />
                )}
              </div>
            </div>
            <WSButton
              onClick={submit}
              disabled={
                checking || !checked || !displayName || displayName.length === 0
              }
            >
              <MdEdit />
            </WSButton>
          </div>
        </div>
      </div>
    </WSModal>
  );
};

export default DisplayNameModal;
