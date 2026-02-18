"use client";

type Props = {
  message: LogEntry;
};

export default function FeedingTimeItem({ message }: Props) {
  const levelColor = {
    information: "text-indigo-300",
    warning: "text-yellow-400",
    error: "text-red-400",
  } as const;

  return (
    <li className="flex items-start gap-x-6 p-4 rounded-lg bg-gray-800 text-gray-100 shadow-md hover:shadow-lg transition-shadow duration-150">
      <div className={`w-2 h-2 mt-2 rounded-full ${levelColor[message.level]}`}></div>

      <div className="flex flex-col space-y-1">
        <div className="flex items-center gap-x-4">
          <span className="text-xs text-gray-400">Time:</span>
          <span className="font-semibold text-sm text-gray-100">
            {message.timeStamp}
          </span>
        </div>
        <p className="text-sm text-gray-200">{message.renderedMessage}</p>
      </div>
    </li>
  );}
    
