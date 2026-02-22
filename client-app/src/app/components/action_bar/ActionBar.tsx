import React from "react";

interface ActionBarProps {
  onFeed: () => void;
  onStopFeed: () => void;
  onFlash: () => void;
  onStopFlash: () => void;
  isMotorRunning: boolean;
  isLightsFlashing: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({ onFeed, onStopFeed, onFlash,onStopFlash, isMotorRunning, isLightsFlashing }) => {
  return (
    <div className="w-full flex gap-2 bg-gray-900 p-3 rounded-md shadow-md">
      <button
        className={`flex-1 font-semibold py-2 rounded transition-colors ${
          isMotorRunning 
            ? "bg-red-600 hover:bg-red-500" 
            : "bg-blue-600 hover:bg-blue-500"
        } text-white`}
        onClick={isMotorRunning ? onStopFeed : onFeed}
      >
        {isMotorRunning ? "Suspend Serving 🛑" : "Serve Snack 🍽️"}
      </button>

      <button
        className={`flex-1 font-semibold py-2 rounded transition-colors ${
          isLightsFlashing 
            ? "bg-red-600 hover:bg-red-500" 
            : "bg-yellow-600 hover:bg-yellow-500"
        } text-white`}
        onClick={isLightsFlashing ? onStopFlash : onFlash}
      >
        {isLightsFlashing ? "Stop Shine ⏹️" : "Shine Signal 💡"}
      </button>
    </div>
  );
};

export default ActionBar;
