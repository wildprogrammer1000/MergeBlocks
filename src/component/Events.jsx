import evt from "@/utils/event-handler";
import { useEffect, useState } from "react";
import { WSCloseButton, WSModal, WSModalHeader } from "./WSComponents";
import { getEvents } from "@/api/nakama";
import { useNakama } from "@/providers/NakamaProvider";
import PropTypes from "prop-types";
const Events = () => {
  const { client, session } = useNakama();
  const [isOpen, setIsOpen] = useState(false);

  const [events, setEvents] = useState([]);

  const init = async () => {
    if (!client || !session) return;
    const { events } = await getEvents();
    setEvents(events);
  };
  useEffect(() => {
    evt.on("events", () => setIsOpen(true));
    return () => {
      evt.off("events", () => setIsOpen(false));
    };
  }, []);

  useEffect(() => {
    isOpen && init();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <WSModal className="p-0 ">
      <WSModalHeader className="flex w-full p-2">
        <div className="text-xl font-bold">EVENTS</div>
        <WSCloseButton
          onClick={() => setIsOpen(false)}
          className="text-2xl rounded-2xl font-bold text-[var(--color-chocolate-100)]"
        />
      </WSModalHeader>
      <div className="p-4 max-h-[500px] overflow-y-auto">
        <div className="flex flex-col gap-4">
          {events.map((event, index) => (
            <Event key={index} {...event} />
          ))}
        </div>
      </div>
    </WSModal>
  );
};

export default Events;

// 📌 개별 이벤트 컴포넌트
const Event = ({
  title,
  description,
  start,
  end,
  prize,
  participation,
  rewardInfo,
}) => {
  return (
    <div className="flex flex-col gap-3 bg-[var(--color-chocolate-300)] text-[var(--color-chocolate-900)] rounded-2xl p-4">
      <div className="font-bold text-2xl">📌 {title}</div>
      <div className="text-md">{description}</div>
      <div className="text-sm text-gray-700">
        📅 {formatDate(start)} ~ {formatDate(end)}
      </div>

      {/* 🎁 경품 */}
      <div className="mt-2">
        <div className="font-bold">🎁 경품</div>
        <ul className="list-disc pl-4 text-sm">
          <li>{prize}</li>
        </ul>
      </div>

      {/* 📣 경품 안내 */}
      <div className="mt-2">
        <div className="font-bold">📣 경품 안내</div>
        <ul className="list-disc pl-4 text-sm">
          {rewardInfo.map((info, idx) => (
            <li key={idx}>{info}</li>
          ))}
        </ul>
      </div>

      {/* 📢 참여 방법 */}
      <div className="mt-2">
        <div className="font-bold">📢 참여 방법</div>
        <ul className="list-disc pl-4 text-sm">
          {participation.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// 📆 날짜 형식 변환 함수
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

Event.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  prize: PropTypes.string.isRequired,
  participation: PropTypes.array.isRequired,
  rewardInfo: PropTypes.array.isRequired,
};
