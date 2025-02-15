import PropTypes from "prop-types";

const WSButton = (props) => {
  return (
    <button
      onClick={props.onClick}
      className={`bg-[var(--color-chocolate-900)] text-[var(--color-chocolate-100)] hover:bg-[var(--color-chocolate-100)] hover:text-[var(--color-chocolate-900)] rounded-2xl  transition-all duration-300 w-12 h-12 flex justify-center items-center text-3xl cursor-pointer ${
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
      className={`absolute inset-0 bg-black/50 flex justify-center items-center ${props.className}`}
    >
      <div
        className="rounded-2xl p-4  bg-[var(--color-chocolate-100)]"
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
      className={`flex justify-between items-center ${props.className || ""}`}
    >
      {props && props.children && props.children}
    </div>
  );
};

WSButton.propTypes = {
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

export { WSButton, WSModal, WSModalHeader };
