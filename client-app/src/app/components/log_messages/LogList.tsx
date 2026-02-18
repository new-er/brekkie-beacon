"use client";

import { LogMessage, default as LogItem } from "./LogItem";

type Props = {
  items: LogItem[];
};

export default function FeedingTimeList({ items = [] }: Props) {
  return (
    <div className="w-full bg-gray-900 p-3 rounded-md shadow-md text-gray-100">
      <div className="text-center font-semibold mb-2 border-b border-gray-700 pb-1">
        Activity Log
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
            <LogItem key={item.id} message={item} />
        ))}
      </ul>
    </div>
  );
}

