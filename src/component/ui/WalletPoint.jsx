import PropTypes from "prop-types";
import { FaCoins } from "react-icons/fa";

const WalletPoint = ({ type, value, className }) => {
  return (
    <div
      className={`flex justify-between items-center gap-2 bg-[var(--color-main-900)] px-4 py-2 rounded-full ${className}`}
    >
      <div className="text-[var(--color-main-100)] text-xl">
        {type === "point" && <FaCoins />}
      </div>
      <div className="font-bold text-[var(--color-main-100)]">{value}</div>
    </div>
  );
};

export default WalletPoint;

WalletPoint.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  className: PropTypes.string,
};
