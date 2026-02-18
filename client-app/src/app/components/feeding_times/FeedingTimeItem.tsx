"use client";

export type FeedingTime = {
  id: string;
  name : string;
  time: string;
};

type Props = {
  feedingTime: FeedingTime;
};

export default function FeedingTimeItem({ feedingTime }: Props) {
  return (
    <li className="flex items-center justify-between gap-x-8 p-4 rounded-lg bg-gray-800 text-gray-100 shadow-md hover:shadow-lg transition-shadow duration-150">
      <div className="flex flex-col space-y-1">
        <span className="text-xs text-gray-400">ID</span>
        <span className="font-semibold text-base text-white">
          {feedingTime.id}
        </span>
      </div>

      <div className="flex flex-col text-center space-y-1">
        <span className="text-xs text-gray-400">Name</span>
        <span className="font-semibold text-base text-indigo-300">
          {feedingTime.name}
        </span>
      </div>

      <div className="flex flex-col items-end space-y-1">
        <span className="text-xs text-gray-400">Time</span>
        <span className="font-semibold text-base text-indigo-400">
          {feedingTime.time}
        </span>
      </div>
    </li>
  );}
