"use client";
import type { LogEntry } from "@/lib/types";
import { default as LogItem } from "./LogItem";
import { useState } from 'react';
import { FaHistory, FaChevronUp, FaChevronDown } from 'react-icons/fa';

type Props = {
  items: LogEntry[];
};

export default function LogList({ items = [] }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    <div className="w-full bg-brand-surface/60 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/5">
      <button
        onClick={toggleExpand}
        className="w-full flex items-center justify-between text-left group transition-all"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-brand-primary/20 text-brand-primary' : 'bg-brand-bg text-brand-muted'}`}>
            <FaHistory className={isExpanded ? 'animate-pulse' : ''} />
          </div>
          <span className="font-bold text-sm uppercase tracking-widest text-brand-muted group-hover:text-brand-primary transition-colors">
            Culinary Chronicles <span className="text-xs opacity-50 ml-1">({items.length})</span>
          </span>
        </div>
        
        <div className="text-brand-muted group-hover:text-brand-primary transition-colors">
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'
        }`}
      >
        {items.length === 0 ? (
          <div className="text-center text-brand-muted py-8 text-sm italic opacity-50">
            No logs yet. Your pet's adventures will appear here!
          </div>
        ) : (
          <ul className="space-y-3 pr-1 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-brand-primary/20">
            {items.map((item) => (
              <LogItem key={item.id} message={item} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
