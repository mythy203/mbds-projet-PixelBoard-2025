// filepath: c:\Users\test\Documents\GitHub\mbds-projet-PixelBoard-2025\packages\client\src\components\TitleOverlay.jsx
import React from "react";

const TitleOverlay = ({ title }) => {
  return (
    <div
      className="absolute top-0 left-0 m-4 p-4 bg-black bg-opacity-70 text-white rounded shadow-lg"
      style={{ zIndex: 1000 }}
    >
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );
};

export default TitleOverlay;
