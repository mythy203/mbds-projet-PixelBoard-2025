import React from "react";

const ResetViewButton = ({ onReset }) => {
  return (
    <button
      onClick={onReset}
      className="absolute bottom-0 left-0 m-4 p-2 bg-blue-600 text-white rounded shadow-lg z-10 hover:bg-blue-700 transition"
    >
      Recentrer
    </button>
  );
};

export default ResetViewButton;
