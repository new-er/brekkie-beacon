import React from "react";

interface ActionBarProps {
  onFeed: () => void;
  onStopFeed: () => void;
  onFlash: () => void;
  onStopFlash: () => void;
  isMotorRunning: boolean;
  isLightsFlashing: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({
  onFeed,
  onStopFeed,
  onFlash,
  onStopFlash,
  isMotorRunning,
  isLightsFlashing
}) => {
  return (
    <div className="w-full flex flex-col sm:flex-row gap-3 bg-brand-surface/60 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/5">

      <button
        className={`flex-1 font-bold py-4 px-2 rounded-xl transition-all active:scale-95 shadow-lg ${isMotorRunning
            ? "bg-brand-secondary text-white shadow-brand-secondary/20 hover:brightness-110"
            : "bg-brand-primary text-brand-bg shadow-brand-primary/20 hover:brightness-110"
          }`}
        onClick={isMotorRunning ? onStopFeed : onFeed}
      >
        <span className="flex flex-row sm:flex-row items-center justify-center gap-2 text-sm sm:text-base">
          {isMotorRunning ? (
            <>
              <span className="leading-tight">Suspend Serving</span>
              <span className="text-xl">🛑</span>
            </>
          ) : (
            <>
              <span className="leading-tight">Serve Snack</span>
              <span className="text-xl">🍽️</span>
            </>
          )}
        </span>
      </button>

      <button
        className={`flex-1 font-bold py-4 px-2 rounded-xl transition-all active:scale-95 shadow-lg ${isLightsFlashing
            ? "bg-brand-secondary text-white shadow-brand-secondary/20 hover:brightness-110"
            : "bg-brand-accent text-white shadow-brand-accent/20 hover:brightness-110"
          }`}
        onClick={isLightsFlashing ? onStopFlash : onFlash}
      >
        <span className="flex flex-row sm:flex-row items-center justify-center gap-2 text-sm sm:text-base">
          {isLightsFlashing ? (
            <>
              <span className="leading-tight">Stop Shine</span>
              <span className="text-xl">⏹️</span>
            </>
          ) : (
            <>
              <span className="leading-tight">Light LEDs</span>
              <span className="text-xl">💡</span>
            </>
          )}
        </span>
      </button>
    </div>
  );
};

export default ActionBar;
