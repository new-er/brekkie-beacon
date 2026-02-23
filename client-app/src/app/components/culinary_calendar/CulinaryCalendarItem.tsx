"use client";

import { useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import type { FeedingTime } from "@/lib/types";

type Props = {
  feedingTime: FeedingTime;
  onUpdate: (updated: FeedingTime) => void;
  onDelete: (id: string) => void;
};

export default function CulinaryCalendarItem({
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
  <li className="flex items-start justify-between gap-x-4 p-5 rounded-2xl bg-brand-card/50 border border-white/5 hover:border-brand-primary/20 transition-all duration-300 group">
    <div className="flex-1 space-y-3">
      {isEditing ? (
       <div className="grid grid-cols-1 gap-y-4">
          <div className="space-y-3">
            {[
              { label: "Name", val: editName, set: setEditName, type: "text" },
              { label: "⏰ Time", val: editTime, set: setEditTime, type: "time" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col sm:flex-row sm:items-center gap-x-3">
                <label className="text-brand-muted text-xs uppercase tracking-widest min-w-[120px]">{item.label}</label>
                <input
                  className="px-3 py-1.5 rounded-lg bg-brand-bg text-white border border-white/10 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 outline-none flex-1 transition-all"
                  type={item.type}
                  value={item.val}
                  onChange={(e) => item.set(e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-3">
              <label className="text-brand-muted text-xs uppercase tracking-widest min-w-[120px]">⚙️ Steps</label>
              <input
                className="px-3 py-1.5 rounded-lg bg-brand-bg text-white border border-white/10 focus:border-brand-primary outline-none w-full sm:w-32"
                type="number"
                value={editSteps}
                onChange={(e) => setEditSteps(Number(e.target.value))}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-x-3">
              <label className="text-brand-muted text-xs uppercase tracking-widest min-w-[120px]">⏱️ Wait (ms)</label>
              <div className="flex items-center gap-2 flex-1">
                <input
                  className="px-3 py-1.5 rounded-lg bg-brand-bg text-white border border-white/10 focus:border-brand-primary outline-none w-full sm:w-32"
                  type="text"
                  value={editWait}
                  onChange={(e) => setEditWait(e.target.value)}
                />
                <span className="text-brand-muted text-xs">per step</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-x-3">
              <label className="text-brand-muted text-xs uppercase tracking-widest min-w-[120px]">🔄 Direction</label>
              <button 
                onClick={() => setEditNegate(!editNegate)}
                className={`px-4 py-1.5 rounded-lg border transition-all text-xs font-bold uppercase tracking-tighter ${
                  editNegate 
                    ? "bg-brand-secondary/20 border-brand-secondary text-brand-secondary" 
                    : "bg-brand-primary/20 border-brand-primary text-brand-primary"
                }`}
              >
                {editNegate ? "Reverse Rotation" : "Normal Rotation"}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center gap-x-3">
            <label className="text-brand-muted text-xs uppercase tracking-widest min-w-[120px]">💡 Brightness</label>
            <div className="flex items-center gap-4 flex-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={editBrightness}
                onChange={(e) => setEditBrightness(Number(e.target.value))}
                className="flex-1 accent-brand-primary-yellow h-1.5 bg-brand-bg rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-brand-primary-yellow font-mono text-xs w-8">
                {Math.round(editBrightness * 100)}%
              </span>
            </div>
          </div>
        </div>      ) : (
        <div className="relative">
          <div className="flex items-center gap-x-3 mb-2">
            <span className="text-brand-primary font-bold text-lg tracking-tight">{feedingTime.name}</span>
            <span className="px-2 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary text-xs font-mono border border-brand-primary/20">
              {feedingTime.time.slice(0, 5)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-brand-muted text-sm">
              <span className="opacity-50">⚙️</span> 
              <span>{feedingTime.motorInstructions.steps} <span className="text-xs opacity-60 uppercase">steps</span></span>
            </div>
            <div className="flex items-center gap-2 text-brand-muted text-sm">
              <span className="opacity-50">⏱️</span> 
              <span>{formatTime(feedingTime.motorInstructions.waitBetweenSteps)} <span className="text-xs opacity-60 uppercase">ms delay</span></span>
            </div>
            <div className="flex items-center gap-2 text-brand-muted text-sm">
              <span className="opacity-50">🔄</span> 
              <span>{feedingTime.motorInstructions.negateDirection ? "Reversed" : "Normal"}</span>
            </div>
            <div className="flex items-center gap-2 text-brand-muted text-sm">
              <span className="opacity-50">💡</span> 
              <div className="w-16 h-1.5 bg-brand-bg rounded-full overflow-hidden inline-block align-middle ml-1 border border-white/5">
                <div className="h-full bg-brand-primary-yellow" style={{ width: `${feedingTime.ledInstructions.brightness * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    <div className="flex items-center gap-x-3 shrink-0">
      {isEditing ? (
        <>
          <button onClick={handleSave} className="p-2 rounded-full hover:bg-green-500/10 text-brand-success transition-colors"><FaCheck /></button>
          <button onClick={handleCancel} className="p-2 rounded-full hover:bg-brand-secondary/10 text-brand-secondary transition-colors"><FaTimes /></button>
        </>
      ) : (
        <>
          <button onClick={() => setIsEditing(true)} className="p-2 rounded-full hover:bg-brand-primary/10 text-brand-primary opacity-40 group-hover:opacity-100 transition-all"><FaEdit /></button>
          <button onClick={() => onDelete(feedingTime.id)} className="p-2 rounded-full hover:bg-brand-secondary/10 text-brand-secondary opacity-40 group-hover:opacity-100 transition-all"><FaTrash /></button>
        </>
      )}
    </div>
  </li>
);}


function formatTime(time: string): string {
  const match = time.match(/\.(\d+)/);
  if (!match) return "0 ms";

  const nanos = Number(match[1].slice(0, 9));
  const ms = nanos / 10_000;

  const str = ms % 1 === 0
    ? String(ms)
    : ms.toFixed(3)
        .replace(/0+$/, '')
        .replace(/\.$/, '');

  return str;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
