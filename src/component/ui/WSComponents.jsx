import { app } from "playcanvas";
import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";
const WSButton = ({ type = "click", ...props }) => {
  return (
    <button
      disabled={props.disabled || false}
      onClick={() => {
        props?.onClick();
        app && app.fire(`sound:play`, type);
      }}
      className={`bg-[var(--color-main-900)] text-[var(--color-main-100)] hover:bg-[var(--color-main-100)] hover:text-[var(--color-main-900)] rounded-2xl  transition-all duration-300 w-12 h-12 flex justify-center items-center text-3xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        props.className || ""
      }`}
    >
      {props && props.children && props.children}
    </button>
  );
};

const WSModal = (props) => {
  return (
    <div
      onClick={props.onClick}
      className={`absolute inset-0 bg-black/50 flex justify-center items-end ${
        props.className || ""
      }`}
    >
      <div
        className="w-full max-w-[500px] rounded-t-2xl bg-[var(--color-main-100)]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {props && props.children && props.children}
      </div>
    </div>
  );
};
const WSModalHeader = (props) => {
  return (
    <div
      onClick={props.onClick}
      className={`flex justify-between items-center bg-[var(--color-main-900)] text-[var(--color-main-100)] rounded-t-xl ${
        props.className || ""
      }`}
    >
      {props && props.children && props.children}
    </div>
  );
};

const WSCloseButton = (props) => {
  return (
    <button
      onClick={() => {
        props.onClick();
        app && app.fire(`sound:play`, "close");
      }}
      className={`cursor-pointer ${props.className || ""}`}
    >
      <IoMdClose />
    </button>
  );
};

WSButton.propTypes = {
  type: PropTypes.oneOf(["click", "close", "pause"]).isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

WSModal.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

WSModalHeader.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

WSCloseButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export { WSButton, WSModal, WSModalHeader, WSCloseButton };
