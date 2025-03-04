import evt from "@/utils/event-handler";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

// CSS 키프레임 정의
const punchAnimation = [
  { transform: "scale(1)" },
  // { transform: 'scale(1.2)', offset: 0.3 },
  { transform: "scale(1.5)", offset: 0.5 },
  // { transform: 'scale(1.1)', offset: 0.8 },
  { transform: "scale(1)" },
];

const animationOptions = {
  duration: 500,
  easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
};

const WalletDiamond = ({ type, value, className, animate = false }) => {
  const diamondRef = useRef(null);
  const textRef = useRef(null);
  const prevValue = useRef(value);

  useEffect(() => {
    if (!animate) return;
    if (diamondRef.current && prevValue.current !== value) {
      // 값 변경 시 애니메이션 트리거
      diamondRef.current.animate(punchAnimation, animationOptions);
      textRef.current.animate(punchAnimation, animationOptions);
      prevValue.current = value;
    }
  }, [value]);

  return (
    <div
      className={`flex justify-between items-center gap-1 bg-[var(--color-main-900)] px-2 py-1 rounded-2xl ${className}`}
    >
      {type === "diamond" && (
        <img
          ref={diamondRef}
          src="/assets/common/diamond.png"
          className="w-8 transition-transform duration-300"
        />
      )}
      <div ref={textRef} className="font-bold text-[var(--color-main-100)]">
        {value}
      </div>
    </div>
  );
};

export default WalletDiamond;

WalletDiamond.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  className: PropTypes.string,
};
