"use client";

import { FeedingTime, default as FeedingTimeItem } from "./FeedingTimeItem";

type Props = {
  items: FeedingTime[];
};

export default function FeedingTimeList({ items = [] }: Props) {
  return (
    <ul className="feeding-time-list">
      {items.map(item => (
        <FeedingTimeItem key={item.id} feedingTime={item} />
      ))}
    </ul>
  );
}

