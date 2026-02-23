"use client";

import type { FeedingTime } from "@/lib/types";
import FeedingTimeItem from "./CulinaryCalendarItem";

type Props = {
  items: FeedingTime[];
  onUpdate: (updated: FeedingTime) => void;
  onDelete: (id: string) => void;
};

export default function CulinaryCalendarList({ items = [], onUpdate, onDelete }: Props) {
  return (
    <ul className="feeding-time-list space-y-4">
      {items.map(item => (
        <FeedingTimeItem key={item.id} feedingTime={item} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  );
}

