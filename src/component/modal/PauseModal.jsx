import { useEffect, useState } from "react";
import { WSButton, WSModal } from "../ui/WSComponents";

import { VscDebugRestart } from "react-icons/vsc";
import { GoHomeFill } from "react-icons/go";
import evt from "@/utils/event-handler";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

const PauseModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    evt.on("pause", openModal);
  }, []);

  if (!isOpen) return;
  return (
    <WSModal onClick={closeModal}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 p-4 bg-[var(--color-chocolate-100)] rounded-2xl">
        <WSButton onClick={() => navigate("/")}>
          <GoHomeFill />
        </WSButton>
        <WSButton
          onClick={() => {
            evt.emit("restart");
            closeModal();
          }}
        >
          <VscDebugRestart />
        </WSButton>
        <WSButton onClick={closeModal}>
          <FaPlay />
        </WSButton>
      </div>
    </WSModal>
  );
};

export default PauseModal;
