import WILDSOFT_LOGO from "@/assets/wildsoft.png";
import PropTypes from "prop-types";

const LoadingView = ({ progress }) => {
  return (
    <div className="absolute top-0 left-0 flex flex-col gap-4 items-center justify-center w-full h-full z-30 bg-[var(--color-main-100)]">
      <img width={128} src={WILDSOFT_LOGO} />
      <div className="w-48 h-1.5 bg-gray-200 border-gray-300 rounded-md overflow-hidden">
        <div
          className={`bg-red-700 h-full transition-width duration-300 w-[${
            progress * 100
          }%]`}
        ></div>
      </div>
    </div>
  );
};

export default LoadingView;

LoadingView.propTypes = {
  progress: PropTypes.number.isRequired,
};
