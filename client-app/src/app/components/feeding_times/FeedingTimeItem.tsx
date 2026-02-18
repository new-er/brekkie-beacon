"use client";

import { useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import type { FeedingTime } from "@/lib/types";

type Props = {
  feedingTime: FeedingTime;
  onUpdate: (updated: FeedingTime) => void;
  onDelete: (id: string) => void;
};

export default function FeedingTimeItem({
  feedingTime,
  onUpdate,
  onDelete,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(feedingTime.name);
  const [editTime, setEditTime] = useState(feedingTime.time);

  function handleSave() {
    onUpdate({ ...feedingTime, name: editName, time: editTime });
    setIsEditing(false);
  }

  function handleCancel() {
    setEditName(feedingTime.name);
    setEditTime(feedingTime.time);
    setIsEditing(false);
  }

  return (
    <li className="flex items-center justify-between gap-x-4 p-4 rounded-lg bg-gray-800 text-gray-100 shadow-md hover:shadow-lg transition duration-150">
      <div className="w-14 text-sm text-gray-400">{feedingTime.id}</div>

      <div className="flex-1 flex items-center gap-x-4">
        {isEditing ? (
          <>
            <input
              className="px-2 py-1 rounded bg-gray-700 text-white"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <input
              className="px-2 py-1 rounded bg-gray-700 text-white"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
            />
          </>
        ) : (
          <>
            <span className="text-indigo-300 font-semibold">{feedingTime.name}</span>
            <span className="text-indigo-400">{feedingTime.time}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-x-2">
        {isEditing ? (
          <>
            <button
              className="text-green-400 hover:text-green-300"
              onClick={handleSave}
              aria-label="Save"
            >
              <FaCheck />
            </button>
            <button
              className="text-yellow-400 hover:text-yellow-300"
              onClick={handleCancel}
              aria-label="Cancel"
            >
              <FaTimes />
            </button>
          </>
        ) : (
          <>
            <button
              className="text-blue-400 hover:text-blue-300"
              onClick={() => setIsEditing(true)}
              aria-label="Edit"
            >
              <FaEdit />
            </button>
            <button
              className="text-red-400 hover:text-red-300"
              onClick={() => onDelete(feedingTime.id)}
              aria-label="Delete"
            >
              <FaTrash />
            </button>
          </>
        )}
      </div>
    </li>
  );
}

