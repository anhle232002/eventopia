import React, { useState, useEffect } from "react";

function CountdownTimer({ target }) {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  function calculateTimeRemaining() {
    const now = new Date().getTime();
    const targetTime = new Date(target).getTime();
    const timeDiff = targetTime - now;

    if (timeDiff <= 0) {
      // Target date has passed, set timeRemaining to 0
      return 0;
    }

    return timeDiff;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor((ms / 1000 / 3600) % 24);
    const days = Math.floor(ms / 1000 / 3600 / 24);

    return (
      <div className="space-x-2">
        <span className="space-x-1">
          {days}
          <strong>D</strong>
        </span>
        <span className="space-x-1">
          {hours}
          <strong>H</strong>
        </span>
        <span className="space-x-1">
          {minutes}
          <strong>M</strong>
        </span>
        <span className="space-x-1">
          {seconds}
          <strong>S</strong>
        </span>
      </div>
    );
  }

  return <div>{timeRemaining > 0 ? <>{formatTime(timeRemaining)}</> : <p>Event Ended</p>}</div>;
}

export default CountdownTimer;
