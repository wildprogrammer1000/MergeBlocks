import PropTypes from "prop-types";
import {
  WSModal,
  WSModalHeader,
  WSCloseButton,
  WSButton,
} from "@/component/ui/WSComponents";
import { useTranslation } from "react-i18next";
const ItemPurchaseModal = ({ isOpen, item, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  if (!isOpen || !item) return null;

  return (
    <WSModal onClick={onCancel} className="bg-transparent">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-main-100)] rounded-2xl w-60">
        <WSModalHeader className="flex w-full p-2">
          <div className="text-xl font-bold">{t("Item Purchase")}</div>
          <WSCloseButton onClick={onCancel} />
        </WSModalHeader>
        <div className="flex flex-col items-center gap-2 p-4">
          <img
            src={`/assets/items/${item.type}.png`}
            alt={item.type}
            width={100}
          />
          <div className="flex flex-col gap-2">
            {t(`ITEM_DESCRIPTION.${item.type}`)}
          </div>
          <div className="flex gap-2 w-full">
            <WSButton size="sm" onClick={onConfirm} className="w-full">
              <img src="/assets/common/diamond.png" alt="diamond" width={32} />
              {item.price}
            </WSButton>
          </div>
        </div>
      </div>
    </WSModal>
  );
};

ItemPurchaseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    type: PropTypes.string,
    price: PropTypes.number,
    amount: PropTypes.number,
  }),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ItemPurchaseModal;
