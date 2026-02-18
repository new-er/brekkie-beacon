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
    const newTime = {
      name: newTimeName.trim(),
      time: "12:00",

    }
    onAdd(newTime);
    setNewTimeName("");
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTimeName}
          onChange={(e) => setNewTimeName(e.target.value)}
          placeholder="New feeding time..."
          className="flex-grow px-3 py-2 border rounded"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <FeedingTimeList
        items={items}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </div>
  );
}

