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
    <li className="relative flex flex-col sm:flex-row items-start justify-between gap-y-4 sm:gap-x-6 p-5 rounded-2xl bg-brand-card/50 border border-white/5 hover:border-brand-primary/20 transition-all duration-300 group">

      <div className="flex-1 w-full space-y-4">
        {isEditing ? (
          <div className="grid grid-cols-1 gap-y-4">
            <div className="space-y-3">
              {[
                { label: "Name", val: editName, set: setEditName, type: "text" },
                { label: "⏰ Time", val: editTime, set: setEditTime, type: "time" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-brand-muted text-[10px] uppercase tracking-widest min-w-[100px]">{item.label}</label>
                  <input
                    className="px-3 py-2 rounded-lg bg-brand-bg text-white border border-white/10 focus:border-brand-primary outline-none flex-1 transition-all"
                    type={item.type}
                    value={item.val}
                    onChange={(e) => item.set(e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-brand-muted text-[10px] uppercase tracking-widest">⚙️ Steps</label>
                  <input
                    className="px-3 py-2 rounded-lg bg-brand-bg text-white border border-white/10 focus:border-brand-primary outline-none w-full"
                    type="number"
                    value={editSteps}
                    onChange={(e) => setEditSteps(Number(e.target.value))}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-brand-muted text-[10px] uppercase tracking-widest">⏱️ Wait (ms)</label>
                  <input
                    className="px-3 py-2 rounded-lg bg-brand-bg text-white border border-white/10 focus:border-brand-primary outline-none w-full"
                    type="text"
                    value={editWait}
                    onChange={(e) => setEditWait(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-brand-muted text-[10px] uppercase tracking-widest">🔄 Direction</label>
                <button
                  onClick={() => setEditNegate(!editNegate)}
                  className={`w-full py-2 rounded-lg border transition-all text-xs font-bold uppercase tracking-wider ${editNegate
                      ? "bg-brand-secondary/20 border-brand-secondary text-brand-secondary"
                      : "bg-brand-primary/20 border-brand-primary text-brand-primary"
                    }`}
                >
                  {editNegate ? "Reverse Rotation" : "Normal Rotation"}
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5">
              <label className="text-brand-muted text-[10px] uppercase tracking-widest block mb-2">💡 Brightness</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0" max="1" step="0.01"
                  value={editBrightness}
                  onChange={(e) => setEditBrightness(Number(e.target.value))}
                  className="flex-1 accent-brand-primary-yellow h-1.5 bg-brand-bg rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-brand-primary-yellow font-mono text-xs w-8 text-right">
                  {Math.round(editBrightness * 100)}%
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-brand-primary font-bold text-xl leading-tight pr-16 sm:pr-0">
                {feedingTime.name}
              </span>
              <span className="inline-block w-fit px-2 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary text-xs font-mono border border-brand-primary/20">
                {feedingTime.time.slice(0, 5)}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-y-3 gap-x-2">
              <Stat icon="⚙️" label="steps" value={feedingTime.motorInstructions.steps} />
              <Stat icon="⏱️" label="delay" value={`${formatTime(feedingTime.motorInstructions.waitBetweenSteps)}ms`} />
              <Stat icon="🔄" label="" value={feedingTime.motorInstructions.negateDirection ? "Reversed" : "Normal"} />
              <div className="flex items-center gap-2">
                <span className="opacity-50 text-sm">💡</span>
                <div className="flex-1 max-w-[60px] h-1.5 bg-brand-bg rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-brand-primary-yellow" style={{ width: `${feedingTime.ledInstructions.brightness * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-4 right-4 sm:static flex items-center gap-x-1 sm:gap-x-2 shrink-0 bg-brand-card sm:bg-transparent rounded-full p-1 sm:p-0 shadow-lg sm:shadow-none border border-white/5 sm:border-none">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="p-2 rounded-full hover:bg-green-500/10 text-brand-success transition-colors"><FaCheck size={14} /></button>
            <button onClick={handleCancel} className="p-2 rounded-full hover:bg-brand-secondary/10 text-brand-secondary transition-colors"><FaTimes size={14} /></button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="p-2 rounded-full hover:bg-brand-primary/10 text-brand-primary sm:opacity-40 group-hover:opacity-100 transition-all"><FaEdit size={14} /></button>
            <button onClick={() => onDelete(feedingTime.id)} className="p-2 rounded-full hover:bg-brand-secondary/10 text-brand-secondary sm:opacity-40 group-hover:opacity-100 transition-all"><FaTrash size={14} /></button>
          </>
        )}
      </div>
    </li>
  );
}

interface StatProps {
  icon: string | React.ReactNode;
  label: string;
  value: string | number;
}
function Stat({ icon, label, value } : StatProps) {
  return (
    <div className="flex items-center gap-2 text-brand-muted text-sm whitespace-nowrap">
      <span className="opacity-50">{icon}</span>
      <span>{value} <span className="text-[10px] opacity-60 uppercase">{label}</span></span>
    </div>
  );
}

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
