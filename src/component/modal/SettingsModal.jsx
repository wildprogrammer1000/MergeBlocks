import evt from "@/utils/event-handler";
import {
  WSModal,
  WSModalHeader,
  WSCloseButton,
  WSButton,
} from "../ui/WSComponents";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { TbMusic, TbMusicOff } from "react-icons/tb";
import { LuVibrate, LuVibrateOff } from "react-icons/lu";

const initialSettings = {
  Sound: true,
  Effect: true,
  // Vibration: true,
};

const iconMap = {
  Sound: {
    true: <HiMiniSpeakerWave />,
    false: <HiMiniSpeakerXMark />,
  },
  Effect: {
    true: <TbMusic />,
    false: <TbMusicOff />,
  },
  Vibration: {
    true: <LuVibrate />,
    false: <LuVibrateOff />,
  },
};

const SettingsModal = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState();

  const open = () => setIsOpen(true);
  const load = () => {
    let settings = localStorage.getItem("settings");
    if (settings) {
      settings = JSON.parse(settings);
      for (const key in initialSettings)
        if (settings[key] === undefined) settings[key] = initialSettings[key];
      setSettings(settings);
    }
  };
  const save = () => {
    evt.emit("settings:update", settings);
    localStorage.setItem("settings", JSON.stringify(settings));
  };
  const returnSettigns = () => settings;
  useEffect(() => {
    load();
    evt.on("settings:open", open);
    return () => {
      evt.off("settings:open", open);
    };
  }, []);

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen]);

  useEffect(() => {
    save();
    evt.method("settings", returnSettigns);
    return () => {
      evt.methodRemove("settings");
    };
  }, [settings]);

  if (!isOpen) return;
  return (
    <WSModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <WSModalHeader className="flex w-full p-2">
        <div className="text-xl font-bold">{t("Settings")}</div>
        <WSCloseButton onClick={() => setIsOpen(false)} />
      </WSModalHeader>
      <div className="flex flex-col gap-4 p-4">
        {Object.keys(initialSettings).map((key) => (
          <div key={key} className="flex items-center justify-between">
            <div className="text-2xl">{t(key)}</div>
            <div>
              <WSButton
                onClick={() =>
                  setSettings({ ...settings, [key]: !settings[key] })
                }
              >
                {iconMap[key] && iconMap[key][settings[key]]}
              </WSButton>
            </div>
          </div>
        ))}
      </div>
    </WSModal>
  );
};

export default SettingsModal;
