import { getPatchNote } from "@/api/rpc";
import { useEffect, useState } from "react";
import evt from "@/utils/event-handler";
import {
  WSCloseButton,
  WSModal,
  WSModalHeader,
} from "@/component/ui/WSComponents";
import { useTranslation } from "react-i18next";
const PatchNoteModal = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [patchNotes, setPatchNotes] = useState([]);
  const load = async () => {
    const response = await getPatchNote();
    setPatchNotes(response.patchNote);
  };
  useEffect(() => {
    evt.on("patchnote:open", () => setIsOpen(true));
    return () => {
      evt.off("patchnote:open", () => setIsOpen(false));
    };
  }, []);
  useEffect(() => {
    isOpen && load();
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <WSModal onClick={() => setIsOpen(false)}>
      <WSModalHeader className="flex w-full p-2">
        <div className="text-xl font-bold">{t("PatchNote")}</div>
        <WSCloseButton onClick={() => setIsOpen(false)} />
      </WSModalHeader>
      <div className="p-4 max-h-[500px] overflow-y-auto">
        <div className="flex flex-col gap-4">
          {patchNotes.map((item, i) => (
            <PatchNoteItem key={"patchnote-" + i} item={item} />
          ))}
        </div>
      </div>
    </WSModal>
  );
};

const PatchNoteItem = ({ item }) => {
  const { t } = useTranslation();
  if (
    !item ||
    !item.version ||
    !item.type ||
    !item.description ||
    Array.isArray(item.description)
  )
    return null;
  return (
    <div className="text-[var(--color-main-900)] border-b-2 rounded-none border-[var(--color-main-900)] rounded-md p-2">
      <div className="text-lg font-bold">
        {t(item.type)} - {item.version}
      </div>
      <ul>
        {item.description.map((desc, i) => (
          <li key={"patchnote-desc-" + i}>{desc}</li>
        ))}
      </ul>
      <div className="text-sm">{item.date}</div>
    </div>
  );
};

export default PatchNoteModal;
