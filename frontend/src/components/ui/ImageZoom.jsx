import React, { useState, useRef } from "react";

const ImageZoom = ({ src, alt, zoomLevel = 2.5, lensSize = 200 }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);
  const imgRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    
    // Exact cursor position inside the container
    let x = e.clientX - left;
    let y = e.clientY - top;

    // Boundaries to prevent the lens from bleeding outside the image entirely
    x = Math.max(0, Math.min(x, width));
    y = Math.max(0, Math.min(y, height));

    // Calculate background position percentages
    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;

    setPosition({ x: xPercent, y: yPercent });
    setCursorPos({ x, y });
    
    if(!showZoom) {
        setShowZoom(true);
    }
  };

  const handleMouseEnter = () => {
    setIsReady(true);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
    setIsReady(false);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        cursor: "crosshair",
        overflow: "hidden"
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={imgRef}
    >
      <img 
        src={src} 
        alt={alt} 
        style={{ 
          width: "100%", 
          height: "100%", 
          objectFit: "cover",
          display: "block"
        }} 
      />
      
      {showZoom && isReady && (
        <div
          style={{
            position: "absolute",
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            transform: "translate(-50%, -50%)",
            width: `${lensSize}px`,
            height: `${lensSize}px`,
            borderRadius: "50%",
            backgroundColor: "#fff",
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundSize: `${zoomLevel * 100}%`, 
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            pointerEvents: "none",
            zIndex: 10,
            animation: "zoomFadeIn 0.2s ease-out forwards"
          }}
        />
      )}
      <style>{`
        @keyframes zoomFadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ImageZoom;
