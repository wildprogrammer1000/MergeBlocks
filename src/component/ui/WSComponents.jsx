import { app } from "playcanvas";
import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";

const ButtonSizes = {
  xs: "w-8 h-8 text-xl",
  sm: "w-10 h-10 text-2xl",
  md: "w-12 h-12 text-3xl",
  lg: "w-14 h-14 text-4xl",
  xl: "w-16 h-16 text-5xl",
};

const WSButton = ({
  type = "click",
  theme = "dark",
  size = "md",
  ...props
}) => {
  return (
    <button
      disabled={props.disabled || false}
      onClick={() => {
        props?.onClick();
        app && app.fire(`sound:play`, type);
      }}
      className={`
        flex justify-center items-center
        ${size !== "custom" ? ButtonSizes[size] : ""}
        rounded-2xl
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-300
        ${
          theme === "light"
            ? `text-[var(--color-main-900)] 
          bg-[var(--color-main-100)]
          border-2 border-[var(--color-main-900)]
          hover:bg-[var(--color-main-900)] hover:text-[var(--color-main-100)]`
            : `text-[var(--color-main-100)] 
          bg-[var(--color-main-900)]
          hover:bg-[var(--color-main-100)] hover:text-[var(--color-main-900)]`
        }
        ${props.className || ""}
      `}
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
      className={`text-2xl rounded-2xl font-bold text-[var(--color-main-100)] cursor-pointer ${
        props.className || ""
      }`}
    >
      <IoMdClose />
    </button>
  );
};

const WSItemAmount = ({ amount, ...props }) => (
  <div
    className={`
absolute
flex items-center justify-center
h-6 px-1.5
text-[12px] font-bold text-[var(--color-main-900)]
border-2 border-[var(--color-main-900)]
bg-[var(--color-main-100)]
rounded-full
${props.className || ""}
`}
  >
    {amount}
  </div>
);
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

export { WSButton, WSModal, WSModalHeader, WSCloseButton, WSItemAmount };
