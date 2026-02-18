import React, { useState } from "react";
import FeedingTimeList from "./FeedingTimeList";

type FeedingTimesViewProps = {
  items: FeedingTime[];
  onAdd: (time: string) => void;
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
    onAdd(newTimeName.trim());
    setNewTimeName("");
  };

  return (
    <div className="w-full bg-gray-900 p-3 rounded-md shadow-md space-y-4">
     <div className="text-center font-semibold mb-2 border-b border-gray-700 pb-1">
        Scheduled Feedings
      </div>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={newTimeName}
          onChange={(e) => setNewTimeName(e.target.value)}
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

      {/* Feedings list */}
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

