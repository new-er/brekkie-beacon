"use client";
import type { LogEntry } from "@/lib/types";
import { FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";

type Props = {
  message: LogEntry;
};

export default function LogItem({ message }: Props) {
 
const levelStyles: Record<string, { dot: string; icon: React.ReactNode; text: string }> = {
  information: {
    dot: "bg-indigo-400",
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
  <li className="flex items-start gap-x-4 p-4 rounded-lg bg-gray-800 text-gray-100 shadow-md hover:shadow-lg transition-shadow duration-150">
      <div className="flex items-center gap-x-3 flex-1">
        <div className="mt-0.5">{style.icon}</div>
        <div className="flex flex-col space-y-1 flex-1">
          <div className="flex items-center gap-x-3 text-xs text-gray-400">
            <span>Time:</span>
            <span className="font-medium text-gray-200">{message.timeStamp}</span>
          </div>
          <p className={`text-sm ${style.text}`}>
            {message.renderedMessage}
          </p>
        </div>
      </div>
    </li>  );}
    
