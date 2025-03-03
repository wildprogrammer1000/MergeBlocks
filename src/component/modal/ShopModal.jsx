import { WSModal, WSModalHeader, WSCloseButton } from "../ui/WSComponents";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import evt from "@/utils/event-handler";

const ShopModal = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    evt.on("shop:open", () => setIsOpen(true));
    return () => {
      evt.off("shop:open", () => setIsOpen(false));
    };
  }, []);
  if (!isOpen) return null;
  return (
    <WSModal onClick={() => setIsOpen(false)}>
      <WSModalHeader className="flex w-full p-2">
        <div className="text-xl font-bold">{t("Shop")}</div>
        <WSCloseButton onClick={() => setIsOpen(false)} />
      </WSModalHeader>
    </WSModal>
  );
};

export default ShopModal;
