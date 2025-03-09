import evt from "@/utils/event-handler";
import { useEffect, useState } from "react";
import {
  WSCloseButton,
  WSModal,
  WSModalHeader,
} from "@/component/ui/WSComponents";
import { getEvents } from "@/api/rpc";
import { useNakama } from "@/providers/NakamaProvider";
import { useTranslation } from "react-i18next";
import Timer from "@/component/ui/Timer";
import PropTypes from "prop-types";

const EventsModal = () => {
  const { t } = useTranslation();
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
    <WSModal onClick={() => setIsOpen(false)}>
      <WSModalHeader className="flex w-full p-2">
        <div className="text-xl font-bold">{t("Events")}</div>
        <WSCloseButton onClick={() => setIsOpen(false)} />
      </WSModalHeader>
      <div className="p-4 max-h-[500px] overflow-y-auto">
        <div className="flex flex-col gap-4">
          {events.length > 0 ? (
            events.map((event, index) => <Event key={index} {...event} />)
          ) : (
            <div className="font-bold text-[var(--color-main-900)]">
              {t("No Events")}
            </div>
          )}
        </div>
      </div>
    </WSModal>
  );
};

export default EventsModal;

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
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 bg-[var(--color-main-300)] text-[var(--color-main-900)] rounded-2xl p-4">
      <Timer endDate={end} />
      <div className="font-bold text-xl">📌 {title}</div>
      <div className="text-md">{description}</div>
      <div className="text-sm text-gray-700">
        📅 {formatDate(start)} ~ {formatDate(end)}
      </div>

      {/* 🎁 경품 */}
      <div className="mt-2">
        <div className="font-bold">🎁 {t("Prize")}</div>
        <ul className="list-disc pl-4 text-sm">
          <li>{prize}</li>
        </ul>
      </div>

      {/* 📣 경품 안내 */}
      <div className="mt-2">
        <div className="font-bold">📣 {t("Prize Info")}</div>
        <ul className="list-disc pl-4 text-sm">
          {rewardInfo.map((info, idx) => (
            <li key={idx}>{info}</li>
          ))}
        </ul>
      </div>

      {/* 📢 참여 방법 */}
      <div className="mt-2">
        <div className="font-bold">📢 {t("Participation")}</div>
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
