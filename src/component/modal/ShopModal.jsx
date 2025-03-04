import {
  WSModal,
  WSModalHeader,
  WSCloseButton,
  WSButton,
  WSItemAmount,
} from "@/component/ui/WSComponents";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { getShopProducts } from "@/api/rpc";
import evt from "@/utils/event-handler";

const Items = [{ type: "item_sniping", price: 50 }];
const ShopModal = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState({
    items: [],
    diamonds: [],
  });
  const [isOpen, setIsOpen] = useState(false);

  const load = async () => {
    try {
      const products = await getShopProducts();
      setProducts(products);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    evt.on("shop:open", () => setIsOpen(true));
    return () => {
      evt.off("shop:open", () => setIsOpen(false));
    };
  }, []);

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <WSModal onClick={() => setIsOpen(false)}>
      <WSModalHeader className="flex w-full p-2">
        <div className="text-xl font-bold">{t("Shop")}</div>
        <WSCloseButton onClick={() => setIsOpen(false)} />
      </WSModalHeader>
      <div
        className={`
          flex gap-2
          p-2
          bg-[var(--color-main-100)]
        `}
      >
        {products.items.map((item) => (
          <ShopItem key={item.type} {...item} />
        ))}
      </div>
    </WSModal>
  );
};

export default ShopModal;

const ShopItem = ({ type, price, amount }) => {
  return (
    <div
      className={`
      flex flex-col justify-center items-center
      border-2 border-[var(--color-main-900)]
      w-24
      rounded-2xl
      p-2
    `}
    >
      <div className={"w-fit relative"}>
        <img src={`/assets/items/${type}.png`} alt={type} width={64} />
        <WSItemAmount
          amount={`x${amount}`}
          className=" bottom-0 right-0 -translate-y-1.5"
        />
      </div>

      <div className="flex flex-col w-full">
        <WSButton size="custom" className={`h-fit text-[16px]`}>
          <img src="/assets/items/diamond.png" alt="diamond" width={28} />
          {price}
        </WSButton>
      </div>
    </div>
  );
};
