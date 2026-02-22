import React, { useState } from "react";
import type { FeedingTime } from "@/lib/types";
import FeedingTimeList from "./FeedingTimeList";

type FeedingTimesViewProps = {
  items: FeedingTime[];
  onAdd: (time: FeedingTime) => void;
  onUpdate: (item: FeedingTime) => void;
  onDelete: (id: string) => void;
};

export default function FeedingTimesView({
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
    <div className="w-full bg-gray-900 p-3 rounded-md shadow-md space-y-4">
     <div className="text-center font-semibold mb-2 border-b border-gray-700 pb-1">
        🥣 Culinary Calendar 
      </div>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={newTimeName}
          onChange={(e) => setNewTimeName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAdd();
            }
          }}
          placeholder="Add new time..."
          className="flex-grow px-3 py-2 bg-gray-900 text-gray-100 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
        />

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded"
        >
          Add
        </button>
      </div>

      <div className="space-y-3">
        <FeedingTimeList
          items={items}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

