"use client";
import ActionBar from "./components/action_bar/ActionBar";
import FeedingTimesView from "./components/feeding_times/FeedingTimesView";
import LogList from "./components/log_messages/LogList";
import { fetchFeedingTimes, createFeedingTime, updateFeedingTime, deleteFeedingTime, fetchLogEntries, feedNow, flashLights } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Home() {
  var [feedingTimes, setFeedingTimes] = useState<FeedingTime[]>([]);
  var [logEntries, setLogEntries] = useState<LogEntry[]>([]);

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

  useEffect(() => {
    async function loadLogs() {
      try {
        var logs = await fetchLogEntries();
        setLogEntries(logs);
      } catch (error) {
        console.error("Error fetching log entries:", error);
      }
    }
    loadLogs();
  }, []);

  function handleAdd(time: FeedingTime) {
    createFeedingTime(time);
    setFeedingTimes([...feedingTimes, time]);
  }

  function handleUpdate(updated: FeedingTime) {
    updateFeedingTime(updated.id, updated);
    setFeedingTimes(feedingTimes.map(ft => ft.id === updated.id ? updated : ft));
    console.log("Updated feeding time:", updated);
  }

  function handleDelete(id: string) {
    deleteFeedingTime(id);
    setFeedingTimes(feedingTimes.filter(ft => ft.id !== id));
    console.log("Deleted feeding time with id:", id);
  }

  function handleFeedNow() {
    feedNow();
    console.log("Fed the cat immediately!");
  }

  function handleFlashLights() {
    flashLights();
    console.log("Flashed the lights!");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex gap-4 min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <ActionBar onFeed={handleFeedNow} onFlash={handleFlashLights} />
      <FeedingTimesView items={feedingTimes} onAdd={handleAdd} onUpdate={handleUpdate} onDelete={handleDelete} />
      <LogList items={logEntries} />
      </main>
    </div>
  );
}
