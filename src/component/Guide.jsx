import { assets } from "@/playcanvas/assets";
import { useMemo } from "react";
import { FaArrowRotateRight } from "react-icons/fa6";

const Guide = () => {
  const blockImages = useMemo(() => {
    return assets
      .filter((asset) => asset.type === "texture")
      .sort((a, b) => {
        const numA = parseInt(a.name.split("_")[1]);
        const numB = parseInt(b.name.split("_")[1]);
        return numA - numB;
      });
  }, []);

  return (
    <div className="relative w-[300px] h-[300px]">
      <div className="border h-full rounded-full bg-[var(--color-chocolate-900)]">
        {blockImages.map((block, index) => {
          // 시작 위치를 상단 중앙(270도)으로 하고 시계 방향으로 회전
          const angle = 270 + (index * 360) / blockImages.length;
          const radius = 120;

          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);
          const imageSize = 48;

          return (
            <div
              key={block.name}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${150 + x}px`,
                top: `${150 + y}px`,
                width: `${imageSize}px`,
                height: `${imageSize}px`,
              }}
            >
              <div className="absolute  bg-[var(--color-chocolate-400)] rounded-full">
                <img
                  src={block.file.url}
                  alt={block.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          );
        })}
        <div className="absolute w-45 h-45 top-1/2 left-1/2 -translate-1/2 flex items-center justify-center text-lg font-bold bg-[var(--color-chocolate-100)] rounded-full text-[120px] rotate-230 text-[var(--color-chocolate-900)]">
          <FaArrowRotateRight />
        </div>
      </div>
    </div>
  );
};

export default Guide;
