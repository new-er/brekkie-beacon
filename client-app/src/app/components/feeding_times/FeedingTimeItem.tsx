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
              <label className="text-gray-400 text-sm min-w-[100px]">Time</label>
              <input
                className="px-2 py-1 rounded bg-gray-700 text-white flex-1"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-x-3">
              <label className="text-gray-400 text-sm min-w-[100px]">Engine Steps</label>
              <input
                className="px-2 py-1 rounded bg-gray-700 text-white w-24"
                type="number"
                value={editSteps}
                onChange={(e) => setEditSteps(Number(e.target.value))}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-x-3">
              <label className="text-gray-400 text-sm min-w-[100px]">Wait between steps</label>
              <input
                className="px-2 py-1 rounded bg-gray-700 text-white w-24"
                type="text"
                value={editWait}
                onChange={(e) => setEditWait(e.target.value)}
              />
              <span className="text-gray-500 text-sm ml-2">ms</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-x-3">
              <label className="text-gray-400 text-sm min-w-[100px]">Negate Direction</label>
              <label className="flex items-center gap-x-2">
                <input
                  type="checkbox"
                  checked={editNegate}
                  onChange={(e) => setEditNegate(e.target.checked)}
                  className="accent-indigo-500"
                />
                <span className="text-gray-300">{editNegate ? "Yes" : "No"}</span>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-x-3">
              <label className="text-gray-400 text-sm min-w-[100px]">LED Brightness</label>
              <input
                className="px-2 py-1 rounded bg-gray-700 text-white w-24"
                type="number"
                value={editBrightness}
                onChange={(e) => setEditBrightness(Number(e.target.value))}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-baseline gap-x-3">
              <span className="text-indigo-300 font-semibold">{feedingTime.name}</span>
              <span className="text-indigo-400">— {feedingTime.time}</span>
            </div>

            <div className="text-gray-400 text-sm">
              Engine Steps: {feedingTime.motorInstructions.steps}
            </div>
            <div className="text-gray-400 text-sm">
              Wait between steps: {feedingTime.motorInstructions.waitBetweenSteps} ms
            </div>
            <div className="text-gray-400 text-sm">
              Negate Direction: {feedingTime.motorInstructions.negateDirection ? "Yes" : "No"}
            </div>
            <div className="text-gray-400 text-sm">
              <span>LED Brightness: {feedingTime.ledInstructions.brightness}</span>
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
