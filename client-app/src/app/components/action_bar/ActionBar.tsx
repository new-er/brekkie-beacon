import React from "react";

interface ActionBarProps {
  onFeed: () => void;
  onFlash: () => void;
  isMotorRunning: boolean;
  isLightsFlashing: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({ onFeed, onFlash, isMotorRunning, isLightsFlashing }) => {
  const feedButtonText = isMotorRunning ? "Motor running..." : "Feed Now 🍽️";
  const flashButtonText = isLightsFlashing ? "Lights flashing..." : "Flash Lights 💡";

  return (
    <div className="w-full flex gap-2 bg-gray-900 p-3 rounded-md shadow-md">
      <button
        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded transition-colors"
        onClick={onFeed}
        enabled={(!isMotorRunning).toString()}
      >
        {feedButtonText}
      </button>
      <button
        className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 rounded transition-colors"
        onClick={onFlash}
        enabled={(!isLightsFlashing).toString()}
      >
        {flashButtonText}
      </button>
    </div>
  );
};

export default ActionBar;
