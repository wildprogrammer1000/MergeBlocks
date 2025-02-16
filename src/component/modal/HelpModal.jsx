import evt from "@/utils/event-handler";
import { useEffect, useState } from "react";
import { WSModal } from "../ui/WSComponents";
import Guide from "@/component/ui/Guide";

const HelpModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    evt.on("help", () => setIsOpen(true));
  }, []);

  if (!isOpen) return null;

  return (
    <WSModal onClick={() => setIsOpen(false)}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 p-4 bg-[var(--color-chocolate-100)] rounded-2xl">
        <Guide />
      </div>
    </WSModal>
  );
};

export default HelpModal;
