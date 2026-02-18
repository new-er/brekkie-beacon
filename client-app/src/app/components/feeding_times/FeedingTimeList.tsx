"use client";

import { FeedingTime, default as FeedingTimeItem } from "./FeedingTimeItem";

type Props = {
  items: FeedingTime[];
  onUpdate: (updated: FeedingTime) => void;
  onDelete: (id: string) => void;
};

export default function FeedingTimeList({ items = [], onUpdate, onDelete }: Props) {
  return (
    <ul className="feeding-time-list space-y-4">
      {items.map(item => (
        <FeedingTimeItem key={item.id} feedingTime={item} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  );
}

