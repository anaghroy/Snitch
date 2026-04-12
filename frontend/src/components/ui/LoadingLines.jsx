import React from "react";

const LoadingLines = () => {
  const letters = "Loading".split("");

  return (
    <div className="loading-page-container">
      <div className="loading-wrapper">
        {/* Animated letters */}
        {letters.map((letter, idx) => (
          <span
            key={idx}
            className="loading-letter"
            style={{ animationDelay: `${0.1 + idx * 0.105}s` }}
          >
            {letter}
          </span>
        ))}

        {/* Loader background */}
        <div className="loader-bg">
          <div className="loader-gradient" />
        </div>
      </div>
    </div>
  );
};

export default LoadingLines;
