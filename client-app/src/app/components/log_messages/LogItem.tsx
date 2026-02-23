"use client";
import type { LogEntry } from "@/lib/types";
import { FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";

type Props = {
  message: LogEntry;
};

export default function LogItem({ message }: Props) {

  const levelStyles: Record<string, { dot: string; icon: React.ReactNode; text: string }> = {
    information: {
      dot: " bg-indigo-400",
      icon: <FaInfoCircle className="text-indigo-300" size={16} />,
      text: "text-indigo-200",
    },
    warning: {
      dot: "bg-yellow-500",
      icon: <FaExclamationTriangle className="text-yellow-400" size={16} />,
      text: "text-yellow-200",
    },
    error: {
      dot: "bg-red-500",
      icon: <FaExclamationTriangle className="text-red-400" size={16} />,
      text: "text-red-300",
    },
  };

  const style = levelStyles[message.level] || levelStyles.information;

  return (
    <li className="flex items-start gap-x-3 p-4 rounded-xl bg-brand-card/80 border border-white/5 hover:border-brand-primary/20 transition-all group">
      <div className={`mt-1 p-1.5 sm:p-2 rounded-lg bg-brand-bg border border-white/5 ${style.text} shadow-inner shrink-0`}>
        {style.icon}
      </div>

      <div className="flex flex-col space-y-2 flex-1 min-w-0">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-x-2">
            <span className="text-[10px] uppercase tracking-widest text-brand-muted font-bold opacity-70">
              Timestamp
            </span>
            <span className="font-mono text-[10px] text-brand-primary/70 bg-brand-primary/5 px-2 py-0.5 rounded border border-brand-primary/10 w-fit break-all">
              {message.timeStamp}
            </span>
          </div>
        </div>
        <p className={`text-sm leading-snug sm:leading-relaxed ${style.text} opacity-90 break-words`}>
          {message.renderedMessage}
        </p>
      </div>
    </li>
  );
}
