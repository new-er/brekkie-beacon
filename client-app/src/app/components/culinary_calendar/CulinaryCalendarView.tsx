import React, { useState } from "react";
import type { FeedingTime } from "@/lib/types";
import FeedingTimeList from "./CulinaryCalendarList";
import { FaCalendarAlt, FaPlus } from 'react-icons/fa';

type FeedingTimesViewProps = {
  items: FeedingTime[];
  onAdd: (time: FeedingTime) => void;
  onUpdate: (item: FeedingTime) => void;
  onDelete: (id: string) => void;
};

export default function CulinaryCalendarView({
  items,
  onAdd,
  onUpdate,
  onDelete,
}: FeedingTimesViewProps) {
  const [newTimeName, setNewTimeName] = useState("");

  const handleAdd = () => {
    if (!newTimeName.trim()) return;
    const newFeedingTime: FeedingTime = {
      id: crypto.randomUUID(),
      name: newTimeName.trim(),
      time: "12:00",
      motorInstructions: {
        steps: 1450,
        waitBetweenSteps: "00:00:00.0050000",
        negateDirection: false,
      },
      ledInstructions: {
        brightness: 1,
      },
    };

    onAdd(newFeedingTime);
    setNewTimeName("");
  };

  return (
    <div className="w-full bg-brand-surface/60 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/5 space-y-6">

      <div className="flex items-center gap-3 pb-2 border-b border-white/5">
        <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
          <FaCalendarAlt />
        </div>
        <h2 className="font-bold text-sm uppercase tracking-widest text-brand-muted">
          Culinary Calendar
        </h2>
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            value={newTimeName}
            onChange={(e) => setNewTimeName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            placeholder="Name your next snack mission..."
            className="w-full px-4 py-2.5 bg-brand-bg text-gray-100 border border-white/10 rounded-xl focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/20 transition-all placeholder:text-brand-muted/40 text-sm"
          />
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary hover:brightness-110 active:scale-95 text-brand-bg font-bold rounded-xl transition-all shadow-lg shadow-brand-primary/10"
        >
          <FaPlus className="text-xs" />
          <span>Add</span>
        </button>
      </div>

      <div className="space-y-4">
        <FeedingTimeList
          items={items}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
