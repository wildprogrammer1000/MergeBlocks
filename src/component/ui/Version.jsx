import { getVersion } from "@/api/nakama";
import evt from "@/utils/event-handler";
import { useEffect } from "react";
import { compareVersions } from "@/utils/version";
import { useNavigate } from "react-router-dom";

const Version = ({ visible = false }) => {
  // const navigate = useNavigate();
  // const check = async () => {
  //   const { version } = await getVersion();
  //   const appVersion = import.meta.env.VITE_APP_VERSION;
  //   const isPWA = window.matchMedia("(display-mode: standalone)").matches;
  //   if (compareVersions(version, appVersion) > 0) {
  //     alert("App Version Updated");

  //     if (isPWA) {
  //       navigate("/outdated");
  //       evt.emit("version:pwa-outdated");
  //     }
  //   }
  // };

  // useEffect(() => {
  //   evt.on("version:check", check);

  //   return () => {
  //     evt.off("version:check", check);
  //   };
  // }, []);

  return (
    <i
      className={`text-sm text-[var(--color-chocolate-900)] font-bold p-2 ${
        visible ? "block" : "hidden"
      }`}
    >
      v{import.meta.env.VITE_APP_VERSION}
    </i>
  );
};

export default Version;
