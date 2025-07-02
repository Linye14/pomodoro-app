import React, { useState, useRef, useEffect } from "react";
// Import Bootstrap Icons CDN in public/index.html for <i> usage
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  // State
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const intervalRef = useRef(null);
  const beepRef = useRef(null);

  // Format time as mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Increment/Decrement Handlers
  const handleBreakDecrement = () => {
    if (!isRunning && breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };
  const handleBreakIncrement = () => {
    if (!isRunning && breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };
  const handleSessionDecrement = () => {
    if (!isRunning && sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  };
  const handleSessionIncrement = () => {
    if (!isRunning && sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  };

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            // Play beep only at 00:00
            if (beepRef.current) {
              beepRef.current.currentTime = 0;
              beepRef.current.play();
            }
            if (isSession) {
              setTimerLabel("Break");
              setIsSession(false);
              return breakLength * 60;
            } else {
              setTimerLabel("Session");
              setIsSession(true);
              return sessionLength * 60;
            }
          }
          return prev > 0 ? prev - 1 : 0;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isRunning, isSession, breakLength, sessionLength]);

  // Start/Stop handler
  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };

  // Reset handler
  const handleReset = () => {
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel("Session");
    setTimeLeft(25 * 60);
    setIsSession(true);
    // Only pause and rewind beep on reset
    if (beepRef.current) {
      beepRef.current.pause();
      beepRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center bg-gradient"
      style={{
        background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
      }}
    >
      <div className="w-100" style={{ maxWidth: 500 }}>
        <h1
          className="text-center mb-4 fw-bold text-primary"
          style={{ letterSpacing: 2 }}
        >
          25 + 5 Clock
        </h1>
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6">
            <div className="card shadow-sm border-0 bg-info bg-opacity-10">
              <div className="card-body text-center">
                <div id="break-label" className="fw-bold text-info mb-2">
                  Break Length
                </div>
                <div className="btn-group" role="group">
                  <button
                    id="break-decrement"
                    className="btn btn-outline-info"
                    onClick={handleBreakDecrement}
                    aria-label="Decrease break"
                    disabled={isRunning}
                  >
                    <i className="bi bi-dash-circle fs-4"></i>
                  </button>
                  <span id="break-length" className="mx-3 fs-4 text-info">
                    {breakLength}
                  </span>
                  <button
                    id="break-increment"
                    className="btn btn-outline-info"
                    onClick={handleBreakIncrement}
                    aria-label="Increase break"
                    disabled={isRunning}
                  >
                    <i className="bi bi-plus-circle fs-4"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="card shadow-sm border-0 bg-success bg-opacity-10">
              <div className="card-body text-center">
                <div id="session-label" className="fw-bold text-success mb-2">
                  Session Length
                </div>
                <div className="btn-group" role="group">
                  <button
                    id="session-decrement"
                    className="btn btn-outline-success"
                    onClick={handleSessionDecrement}
                    aria-label="Decrease session"
                    disabled={isRunning}
                  >
                    <i className="bi bi-dash-circle fs-4"></i>
                  </button>
                  <span id="session-length" className="mx-3 fs-4 text-success">
                    {sessionLength}
                  </span>
                  <button
                    id="session-increment"
                    className="btn btn-outline-success"
                    onClick={handleSessionIncrement}
                    aria-label="Increase session"
                    disabled={isRunning}
                  >
                    <i className="bi bi-plus-circle fs-4"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card shadow-lg border-0 bg-white bg-opacity-75 mb-4">
          <div className="card-body text-center">
            <div
              id="timer-label"
              className="fs-3 mb-2 fw-semibold text-secondary"
            >
              {timerLabel}
            </div>
            <div
              id="time-left"
              className="display-2 mb-3 fw-bold text-dark"
              style={{ fontVariantNumeric: "tabular-nums", letterSpacing: 2 }}
            >
              {formatTime(timeLeft)}
            </div>
            <div className="d-flex justify-content-center gap-3">
              <button
                id="start_stop"
                className="btn btn-lg btn-primary px-4"
                onClick={handleStartStop}
                aria-label="Start or stop timer"
              >
                <i
                  className={isRunning ? "bi bi-pause-fill" : "bi bi-play-fill"}
                ></i>
              </button>
              <button
                id="reset"
                className="btn btn-lg btn-danger px-4"
                onClick={handleReset}
                aria-label="Reset timer"
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <audio
        id="beep"
        ref={beepRef}
        preload="auto"
        src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"
      />
    </div>
  );
}

export default App;
