"use client";
import FeedingTimeList from "./components/feeding_times/FeedingTimeList";
import LogList from "./components/log_messages/LogList";
import { fetchFeedingTimes, updateFeedingTime, deleteFeedingTime } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Home() {
  var [feedingTimes, setFeedingTimes] = useState<FeedingTime[]>([]);

  useEffect(() => {
    async function load() {
      try {
        var data = await fetchFeedingTimes();
        setFeedingTimes(data);
      } catch (error) {
        console.error("Error fetching feeding times:", error);
      }
    }
    load();
  }, []);

  function handleUpdate(updated: FeedingTime) {
    updateFeedingTime(updated.id, updated);
    console.log("Updated feeding time:", updated);
  }

  function handleDelete(id: string) {
    deleteFeedingTime(id);
    console.log("Deleted feeding time with id:", id);
  }

  const mockLogMessages: LogMessage[] = [
    { id: "1", time: "2024-06-01T08:00:00Z", message: "Fed the cat in the morning." },
    { id: "2", time: "2024-06-01T18:00:00Z", message: "Fed the cat in the evening." },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <FeedingTimeList items={feedingTimes} onUpdate={handleUpdate} onDelete={handleDelete} />
      <LogList items={mockLogMessages} />
      </main>
    </div>
  );
}
