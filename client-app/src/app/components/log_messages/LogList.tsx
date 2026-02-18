"use client";

import { LogMessage, default as LogItem } from "./LogItem";

type Props = {
  items: LogItem[];
};

export default function FeedingTimeList({ items = [] }: Props) {
  return (
    <ul className="feeding-time-list">
      {items.map(item => (
        <LogItem key={item.id} message={item} />
      ))}
    </ul>
  );
}

