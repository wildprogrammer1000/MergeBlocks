import { getVersion } from "@/api/rpc";
import { useEffect, useState } from "react";
import { compareVersions } from "@/utils/version";
import evt from "@/utils/event-handler";
import { useTranslation } from "react-i18next";

const Version = ({ visible = false }) => {
  const { t } = useTranslation();
  const [isUpdaterVisible, setIsUpdaterVisible] = useState(false);
  const check = async () => {
    const { version } = await getVersion();
    const appVersion = import.meta.env.VITE_APP_VERSION;
    const isPWA = window.matchMedia("(display-mode: standalone)").matches;
    if (compareVersions(version, appVersion) > 0) {
      // alert("App Version Updated");
      if (isPWA) {
        evt.emit("view:outdated");
        evt.emit("version:pwa-outdated");
      } else {
        setIsUpdaterVisible(true);
      }
    }
  };
  const openNewWindow = () => {
    const newTab = window.open(window.location.href, "_blank");
    newTab.focus();
    window.close();
  };
  useEffect(() => {
    evt.on("version:check", check);

    return () => {
      evt.off("version:check", check);
    };
  }, []);

  return (
    <>
      <i
        className={`text-sm text-[var(--color-main-900)] font-bold p-2 ${
          visible ? "block" : "hidden"
        }`}
      >
        v{import.meta.env.VITE_APP_VERSION}
      </i>
      {isUpdaterVisible && (
        <button
          className="absolute top-2 left-1/2 -translate-x-1/2 bg-[var(--color-main-900)] text-[var(--color-main-100)] p-2 rounded-xl hover:underline cursor-pointer"
          onClick={openNewWindow}
        >
          {t("Update Version")}
        </button>
      )}
    </>
  );
};

export default Version;
