import { doHealthCheck, getServerConfig } from "@/api/nakama";
import { useNakama } from "@/providers/NakamaProvider";
import { useEffect, useRef, useState } from "react";
import { WSModal, WSModalHeader } from "./ui/WSComponents";
import { CgSpinner } from "react-icons/cg";
1;
const NetworkController = () => {
  const [isHealthy, setIsHealthy] = useState(true);
  const [isServerOpen, setServerOpen] = useState(true);
  const { session } = useNakama();
  const healthCheckRef = useRef();
  const healthCheck = async () => {
    try {
      doHealthCheck();
      setIsHealthy(true);
    } catch (err) {
      console.error(err);
      setIsHealthy(false);
    }
  };
  const checkServerStatus = async () => {
    try {
      const { config } = await getServerConfig();
      setServerOpen(config.open);
    } catch (err) {
      console.error(err);
      setServerOpen(false);
    }
  };
  const startHealthCheck = () => {
    healthCheckRef.current = setInterval(() => {
      healthCheck();
      checkServerStatus();
    }, 5000);
  };
  const stopHealthCheck = () => {
    healthCheckRef.current && clearInterval(healthCheckRef.current);
  };
  useEffect(() => {
    session ? startHealthCheck() : stopHealthCheck();
  }, [session]);
  return !isHealthy ? (
    <WSModal className="absolute inset-0 z-30">
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center bg-[var(--color-main-100)] rounded-2xl">
        <WSModalHeader className="flex w-full p-2">
          <div className="text-xl font-bold">NETWORK ERROR</div>
        </WSModalHeader>
        <div className="flex gap-2 text-[var(--color-main-900)] pt-2 pb-4 font-bold">
          <CgSpinner className="animate-spin text-2xl text-chocolate-900" />
          reconnecting...
        </div>
      </div>
    </WSModal>
  ) : (
    !isServerOpen && (
      <WSModal className="absolute inset-0 z-30">
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-[var(--color-main-100)] overflow-hidden">
          <div className="text-xl font-bold text-[var(--color-main-900)] text-center">
            SERVER IS <br />
            TEMPORARILIY CLOSED
          </div>
        </div>
      </WSModal>
    )
  );
};

export default NetworkController;
