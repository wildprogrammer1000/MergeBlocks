import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Timer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const finishTime = new Date(endDate);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = finishTime - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  if (
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0
  )
    return null;
  return (
    <div className="flex gap-2 justify-center items-center font-bold border-2 border-[var(--color-chocolate-900)] rounded-full px-2">
      <TimeUnit value={timeLeft.days} unit="D" />
      <TimeUnit value={timeLeft.hours} unit="H" />
      <TimeUnit value={timeLeft.minutes} unit="M" />
      <TimeUnit value={timeLeft.seconds} unit="S" />
    </div>
  );
};

const TimeUnit = ({ value, unit }) => (
  <div className="flex items-center gap-1 text-[var(--color-chocolate-900)]">
    <span className="min-w-[2ch] text-center">
      {value.toString().padStart(2, "0")}
    </span>
    <span className="text-sm">{unit}</span>
  </div>
);

export default Timer;

Timer.propTypes = {
  endDate: PropTypes.string.isRequired,
};
