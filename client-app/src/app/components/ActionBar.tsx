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
    <div className="w-full flex gap-3 bg-brand-surface/60 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/5">
      
      <button
        className={`flex-1 font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg ${
          isMotorRunning 
            ? "bg-brand-secondary text-white shadow-brand-secondary/20 hover:brightness-110" 
            : "bg-brand-primary text-brand-bg shadow-brand-primary/20 hover:brightness-110"
        }`}
        onClick={isMotorRunning ? onStopFeed : onFeed}
      >
        <span className="flex items-center justify-center gap-2">
          {isMotorRunning ? (
            <>Suspend Serving <span className="text-lg">🛑</span></>
          ) : (
            <>Serve Snack <span className="text-lg">🍽️</span></>
          )}
        </span>
      </button>

      <button
        className={`flex-1 font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg ${
          isLightsFlashing 
            ? "bg-brand-secondary text-white shadow-brand-secondary/20 hover:brightness-110" 
            : "bg-brand-accent text-white shadow-brand-accent/20 hover:brightness-110"
        }`}
        onClick={isLightsFlashing ? onStopFlash : onFlash}
      >
        <span className="flex items-center justify-center gap-2">
          {isLightsFlashing ? (
            <>Stop Shine <span className="text-lg">⏹️</span></>
          ) : (
            <>Light LEDs <span className="text-lg">💡</span></>
          )}
        </span>
      </button>
    </div>
  );
};export default ActionBar;
