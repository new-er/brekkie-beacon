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
    <li className="flex items-start justify-between gap-x-4 p-4 rounded-lg bg-gray-800 text-gray-100 shadow-md hover:shadow-lg transition duration-150">
      <div className="flex-1 space-y-2">
        {isEditing ? (
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-3">
              <label className="text-gray-400 text-sm min-w-[100px]">Name</label>
              <input
                className="px-2 py-1 rounded bg-gray-700 text-white flex-1"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-x-3">
              <label className="text-gray-400 text-sm min-w-[100px]">⏰ Time</label>
              <input
                aria-label="Time"
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                className="flex-1 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-x-3">
              <label className="text-gray-400 text-sm min-w-[100px]">⚙️ Steps</label>
              <input
                className="flex-1 px-2 py-1 rounded bg-gray-700 text-white w-24"
                type="number"
                value={editSteps}
                onChange={(e) => setEditSteps(Number(e.target.value))}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-x-3">
              <label className="text-gray-400 text-sm min-w-[100px]">⏱️ Wait between steps</label>
              <input
                className="flex-1 px-2 py-1 rounded bg-gray-700 text-white w-24"
                type="text"
                value={editWait}
                onChange={(e) => setEditWait(e.target.value)}
              />
              <span className="text-gray-500 text-sm ml-2">ms</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-x-3">
              <label className="text-gray-400 text-sm min-w-[100px]">🔄 Direction</label>
              <label className="flex items-center gap-x-2">
                <input
                  type="checkbox"
                  checked={editNegate}
                  onChange={(e) => setEditNegate(e.target.checked)}
                  className="flex-1 accent-indigo-500"
                />
                <span className="text-gray-300">{editNegate ? "Reversed" : "Normal"}</span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-x-3">
              <label className="text-gray-400 text-sm min-w-[100px]">💡 Brightness</label>
              <input
                className="flex-1 px-2 py-1 rounded bg-gray-700 text-white w-24"
                type="number"
                step={0.01}
                min={0}
                max={1}
                value={editBrightness}
                onChange={(e) => setEditBrightness(clamp(Number(e.target.value), 0, 1))}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-baseline gap-x-3">
              <span className="text-indigo-300 font-semibold">{feedingTime.name}</span>
              <span className="text-indigo-400">— {feedingTime.time.slice(0, 5)}</span>
            </div>

            <div className="text-gray-400 text-sm">
              ⚙️ {feedingTime.motorInstructions.steps} steps
            </div>
            <div className="text-gray-400 text-sm">
              ⏱️ {formatTime(feedingTime.motorInstructions.waitBetweenSteps)} ms delay between steps
            </div>
            <div className="text-gray-400 text-sm">
              🔄 Direction: {feedingTime.motorInstructions.negateDirection ? "Reversed" : "Normal"}
            </div>
            <div className="text-gray-400 text-sm">
              💡 Brightness {feedingTime.ledInstructions.brightness}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-x-2 shrink-0 pt-1">
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


function formatTime(time: string): string {
  // Extract digits after the dot (sub-second part)
  const match = time.match(/\.(\d+)/);
  if (!match) return "0 ms";

  const nanos = Number(match[1].slice(0, 9)); // up to 9 digits
  const ms = nanos / 10_000;

  const str = ms % 1 === 0
    ? String(ms)              // integer
    : ms.toFixed(3)           // 3 decimals max
        .replace(/0+$/, '')    // remove trailing zeros
        .replace(/\.$/, '');   // remove trailing dot

  return str;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
