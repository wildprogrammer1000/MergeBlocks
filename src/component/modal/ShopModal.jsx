import { useState, useEffect } from "react";
import {
  WSModal,
  WSModalHeader,
  WSCloseButton,
  WSButton,
  WSItemAmount,
} from "@/component/ui/WSComponents";
import { useTranslation } from "react-i18next";
import { getShopProducts, purchaseItem } from "@/api/rpc";
import evt from "@/utils/event-handler";
import PropTypes from "prop-types";
import ItemPurchaseModal from "@/component/modal/ItemPurchaseModal";
import { useNakama } from "@/providers/NakamaProvider";

const ShopModal = () => {
  const { refreshAccount } = useNakama();
  const { t } = useTranslation();
  const [products, setProducts] = useState({
    items: [],
    diamonds: [],
  });
  const [isOpen, setIsOpen] = useState(false);

  // 구매 확인 팝업 관리 state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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

  // 구매 확인 이벤트 핸들러 (보통은 이벤트 버스 혹은 컨텍스트를 활용)
  const openPurchaseConfirmation = (item) => {
    setSelectedItem(item);
    setConfirmModalOpen(true);
  };

  // 실제 구매 처리 함수
  const handlePurchaseConfirm = async () => {
    try {
      // 구매 로직 실행
      const { success } = await purchaseItem(selectedItem);
      if (success) {
        await refreshAccount();
        setConfirmModalOpen(false);
        setSelectedItem(null);
        alert(t("Purchase Success"));
      } else {
        alert(t("Purchase Failed"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePurchaseCancel = () => {
    setConfirmModalOpen(false);
  };

  if (!isOpen) return null;
  return (
    <>
      <WSModal onClick={() => setIsOpen(false)}>
        <WSModalHeader className="flex w-full p-2">
          <div className="text-xl font-bold">{t("Shop")}</div>
          <WSCloseButton onClick={() => setIsOpen(false)} />
        </WSModalHeader>
        <div className="flex gap-2 p-2 bg-[var(--color-main-100)]">
          {products.items.map((item) => (
            <ShopItem
              key={item.type}
              {...item}
              onSelect={openPurchaseConfirmation}
            />
          ))}
        </div>
      </WSModal>

      <ItemPurchaseModal
        isOpen={confirmModalOpen}
        item={selectedItem}
        onConfirm={handlePurchaseConfirm}
        onCancel={handlePurchaseCancel}
      />
    </>
  );
};

export default ShopModal;

const ShopItem = ({ id, type, price, amount, onSelect }) => {
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
      <div className="w-fit relative">
        <img src={`/assets/items/${type}.png`} alt={type} width={64} />
        <WSItemAmount
          amount={`x${amount}`}
          className="bottom-0 right-0 -translate-y-1.5 h-5!"
        />
      </div>

      <div className="flex flex-col w-full">
        <WSButton
          size="custom"
          className="h-fit text-[16px]"
          onClick={() => onSelect({ id, type, price, amount })}
        >
          <img src="/assets/common/diamond.png" alt="diamond" width={28} />
          {price}
        </WSButton>
      </div>
    </div>
  );
};

ShopItem.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};
