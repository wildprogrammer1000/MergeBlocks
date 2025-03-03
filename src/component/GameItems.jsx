import { useNakama } from "@/providers/NakamaProvider";
import { WSButton } from "./ui/WSComponents";
import evt from "@/utils/event-handler";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { app } from "playcanvas";

const ITEMS = {
  item_sniping: {
    name: "Item_Sniping",
    description: "Item 1 description",
    image_url: "/assets/common/item_sniping.png",
  },
  item_random_blast: {
    name: "Item_Random_Blast",
    description: "Item 1 description",
    image_url: "/assets/common/item_random_blast.png",
  },
  item_earthquake: {
    name: "Item_Earthquake",
    description: "Item 1 description",
    image_url: "/assets/common/item_earthquake.png",
  },
};

const GameItems = () => {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState();
  const [isSelecting, setIsSelecting] = useState(false);
  const onSelectItem = (type) => setSelectedItem(type);
  const handleUseItem = () => {
    if (!selectedItem) return;
    switch (selectedItem) {
      case "item_sniping":
        setIsSelecting(true);
        break;
      case "item_random_blast":
        app.fire("item:random_blast");
        break;
      case "item_earthquake":
        app.fire("item:earthquake");
        break;
    }
    setSelectedItem(null);
  };
  useEffect(() => {
    evt.on("item:select", onSelectItem);
    return () => evt.off("item:select", onSelectItem);
  }, []);
  return (
    <>
      <div
        className={`
        bg-[var(--color-main-100)]
        flex
        gap-8
        p-2
        justify-center
        items-center
        border-t-2
        border-[var(--color-main-900)]
        `}
      >
        <Item type="item_sniping" />
        <Item type="item_random_blast" />
        <Item type="item_earthquake" />
      </div>
      {selectedItem && (
        <div
          className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          flex flex-col items-center gap-1
          bg-[var(--color-main-900)] text-[var(--color-main-100)]
          rounded-2xl
          p-4
          `}
        >
          <div className="flex items-center justify-center bg-[var(--color-main-100)] rounded-2xl">
            <img
              draggable={false}
              src={ITEMS[selectedItem].image_url}
              alt={ITEMS[selectedItem].name}
              className="w-20"
            />
          </div>
          <div className="text-2xl font-bold text-center w-full">
            {t(`ITEM_NAMES.${selectedItem}`)}
          </div>
          <div className="text-center w-full">{t("ITEM_USE")}</div>
          <div className="flex gap-2 w-full mt-2">
            <WSButton
              onClick={handleUseItem}
              size="xs"
              className="flex-1 bg-green-500 text-[var(--color-main-100)] rounded-md"
            >
              <FaCheck />
            </WSButton>
            <WSButton
              onClick={() => setSelectedItem(null)}
              size="xs"
              className="bg-red-500 text-[var(--color-main-100)] rounded-md"
            >
              <IoMdClose />
            </WSButton>
          </div>
        </div>
      )}
    </>
  );
};

export default GameItems;
const Item = ({ type }) => {
  const { wallet } = useNakama();

  if (!ITEMS[type]) return null;
  return (
    <WSButton
      theme="light"
      className="relative"
      onClick={() => evt.emit("item:select", type)}
    >
      <img
        src={ITEMS[type].image_url}
        alt={ITEMS[type].name}
        className="w-20"
      />
      {/* Amount */}
      <div
        className={`
          absolute bottom-0 right-0 translate-x-1/2 translate-y-1.5
          flex items-center justify-center
          h-6 px-1.5
          text-[12px] font-bold text-[var(--color-main-900)]
          border-2 border-[var(--color-main-900)]
          bg-[var(--color-main-100)]
          rounded-full
        `}
      >
        {wallet[type] ? (wallet[type] > 99 ? "99+" : wallet[type]) : 0}
      </div>
    </WSButton>
  );
};

// Point Pop
// Random Blast
// Earthquake
