import evt from "@/utils/event-handler";
import { useEffect, useState } from "react";
import { WSModal } from "../WSComponents";
import Guide from "@/component/Guide";

const HelpModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    evt.on("help", () => setIsOpen(true));
  }, []);

  if (!isOpen) return null;

  return (
    <WSModal onClick={() => setIsOpen(false)}>
      <div className="flex flex-col items-center gap-4">
        <Guide />
      </div>
    </WSModal>
  );
};

export default HelpModal;
