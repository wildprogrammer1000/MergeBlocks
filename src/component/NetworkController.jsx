import { getServerConfig } from "@/api/rpc";
import { useNakama } from "@/providers/NakamaProvider";
import { useEffect, useRef, useState } from "react";
import { WSModal } from "./ui/WSComponents";
import { CgSpinner } from "react-icons/cg";
import { useTranslation } from "react-i18next";
const NetworkController = () => {
  const { t } = useTranslation();
  const [isHealthy, setIsHealthy] = useState(true);
  const [isServerOpen, setServerOpen] = useState(true);
  const [notices, setNotices] = useState(["test", "test2"]);
  const { authenticate, socket } = useNakama();
  const healthCheckRef = useRef();
  const healthCheck = async () => {
    try {
      if (!socket || !socket.adapter.isOpen()) {
        authenticate();
        setIsHealthy(false);
      } else {
        setIsHealthy(true);
      }
    } catch (err) {
      setIsHealthy(false);
    }
  };
  const checkServerStatus = async () => {
    try {
      setIsHealthy(true);
      const { config } = await getServerConfig();
      setServerOpen(config.open);
      if (config.notices) setNotices(config.notices);
    } catch (err) {
      setIsHealthy(false);
      console.log("network disconnected");
    }
  };
  const startHealthCheck = () => {
    healthCheckRef.current = setInterval(() => {
      healthCheck();
      checkServerStatus();
    }, 5000);
  };

  useEffect(() => {
    healthCheckRef.current && clearInterval(healthCheckRef.current);
    startHealthCheck();
  }, [socket]);

  return (
    <>
      {!isServerOpen && (
        <WSModal className="absolute inset-0 z-[9999]">
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-1 bg-[var(--color-main-100)] overflow-hidden">
            <div className="text-xl font-bold text-[var(--color-main-900)] text-center">
              {t("Server Closed")}
            </div>
            {notices.length > 0 && (
              <div className="flex flex-col gap-1">
                {notices.map((notice, index) => (
                  <div key={`notice-${index}`}>{notice}</div>
                ))}
              </div>
            )}
          </div>
        </WSModal>
      )}
      <div
        className={`
          absolute top-0 left-1/2 -translate-x-1/2 z-[9998]
          flex items-center gap-1
          text-[var(--color-main-100)]
          bg-[var(--color-main-900)]
          rounded-b-md
          px-1 pb-0.5
          duration-300
          ${isHealthy ? "-translate-y-full" : "translate-y-0"}
          text-xs
        `}
      >
        <CgSpinner className="animate-spin text-[var(--color-main-100)]" />
        {t("Reconnecting")}...
      </div>
    </>
  );
};

export default NetworkController;
