import { useEffect, useState } from "react";
import { WSButton, WSModal } from "../WSComponents";

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
      <div className="flex gap-2">
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
