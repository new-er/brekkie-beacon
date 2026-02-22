"use client";
import type { LogEntry } from "@/lib/types";
import { default as LogItem } from "./LogItem";
import { useState } from 'react';

type Props = {
  items: LogEntry[];
};

export default function LogList({ items = [] }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded((prev) => !prev);

 return (
    <div className="w-full bg-gray-900 p-3 rounded-md shadow-md text-gray-100 border border-gray-800">
      <button
        onClick={toggleExpand}
        className="w-full flex items-center justify-between text-left font-semibold mb-2 pb-1 border-b border-gray-700 hover:bg-gray-800/50 transition-colors rounded-sm px-1 -mx-1 py-1"
        aria-expanded={isExpanded}
        aria-controls="log-content"
      >
        <span>Culinary Chronicles ({items.length})</span>
        {isExpanded ? (
          <p className="h-5 w-5 text-gray-400" >-</p>
        ) : (
          <p className="h-5 w-5 text-gray-400" >+</p>
        )}
      </button>

      <div
        id="log-content"
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-4 text-sm">
            No activity yet
          </div>
        ) : (
          <ul className="space-y-1">
            {items.map((item) => (
              <LogItem key={item.id} message={item} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );}

