import React, { useState, useEffect, useCallback } from "react";

const DealCountdown = ({ targetDate }) => {
  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }, [targetDate]);  

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeLeft(calculateTimeLeft()); 

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);  

  return (
    <div className="d-flex justify-content-center justify-content-lg-start gap-3 fs-5 fw-semibold">
      {["days", "hours", "minutes", "seconds"].map((unit) => (
        <div key={unit} className="text-center">
          <div className="border p-3 rounded bg-dark text-white">
            {timeLeft[unit] || "0"}
          </div>
          <span className="small text-muted">{unit.charAt(0).toUpperCase() + unit.slice(1)}</span>
        </div>
      ))}
    </div>
  );
};

export default DealCountdown;
