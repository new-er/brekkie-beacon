import React from "react";

interface ActionBarProps {
  onFeed: () => void;
  onFlash: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ onFeed, onFlash }) => {
  return (
    <div className="w-full flex gap-2 bg-gray-900 p-3 rounded-md shadow-md">
      <button
        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded transition-colors"
        onClick={onFeed}
      >
        Feed Now
      </button>
      <button
        className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 rounded transition-colors"
        onClick={onFlash}
      >
        Flash Lights
      </button>
    </div>
  );
};

export default ActionBar;
