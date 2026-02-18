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
  const [editSteps, setEditSteps] = useState(feedingTime.motorInstructions.steps);
  const [editWait, setEditWait] = useState(feedingTime.motorInstructions.waitBetweenSteps);
  const [editNegate, setEditNegate] = useState(feedingTime.motorInstructions.negateDirection);
  const [editBrightness, setEditBrightness] = useState(feedingTime.ledInstructions.brightness);

  function handleSave() {
    onUpdate({
      ...feedingTime,
      name: editName,
      time: editTime,
      motorInstructions: {
        steps: editSteps,
        waitBetweenSteps: editWait,
        negateDirection: editNegate,
      },
      ledInstructions: {
        brightness: editBrightness,
      },
    });
    setIsEditing(false);
  }

  function handleCancel() {
    setEditName(feedingTime.name);
    setEditTime(feedingTime.time);
    setEditSteps(feedingTime.motorInstructions.steps);
    setEditWait(feedingTime.motorInstructions.waitBetweenSteps);
    setEditNegate(feedingTime.motorInstructions.negateDirection);
    setEditBrightness(feedingTime.ledInstructions.brightness);
    setIsEditing(false);
  }

  return (
    <li className="flex items-center justify-between gap-x-4 p-4 rounded-lg bg-gray-800 text-gray-100 shadow-md hover:shadow-lg transition duration-150">
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
            <input
              className="px-2 py-1 rounded bg-gray-700 text-white w-20"
              type="number"
              value={editSteps}
              onChange={(e) => setEditSteps(Number(e.target.value))}
            />
            <input
              className="px-2 py-1 rounded bg-gray-700 text-white w-20"
              value={editWait}
              onChange={(e) => setEditWait(e.target.value)}
            />
            <label className="flex items-center gap-x-1">
              <input
                type="checkbox"
                checked={editNegate}
                onChange={(e) => setEditNegate(e.target.checked)}
              />
              Negate
            </label>
            <input
              className="px-2 py-1 rounded bg-gray-700 text-white w-20"
              type="number"
              value={editBrightness}
              onChange={(e) => setEditBrightness(Number(e.target.value))}
            />
          </>
        ) : (
          <>
            <span className="text-indigo-300 font-semibold">{feedingTime.name}</span>
            <span className="text-indigo-400">{feedingTime.time}</span>
            <span className="text-gray-400 text-sm">
              Steps: {feedingTime.motorInstructions.steps}, Wait: {feedingTime.motorInstructions.waitBetweenSteps}, NegateDirection: {feedingTime.motorInstructions.negateDirection ? "Yes" : "No"}, Brightness: {feedingTime.ledInstructions.brightness}
            </span>
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

