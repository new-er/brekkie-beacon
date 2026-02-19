"use client";
import ActionBar from "./components/action_bar/ActionBar";
import FeedingTimesView from "./components/feeding_times/FeedingTimesView";
import LogList from "./components/log_messages/LogList";
import { fetchFeedingTimes, createFeedingTime, updateFeedingTime, deleteFeedingTime, fetchLogEntries, feedNow, flashLights } from "@/lib/api";
import { useEffect, useState } from "react";
import type { FeedingTime, LogEntry } from "@/lib/types";
import { setApiBaseUrl } from "@/lib/api";

export default function Home() {
  var [feedingTimes, setFeedingTimes] = useState<FeedingTime[]>([]);
  var [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [apiBaseUrl, setApiBaseUrl] = useState("");

  useEffect(() => {
    const loadConfig = async () => {
      const res = await fetch("/api/config");
      const data = await res.json();
      setApiBaseUrl(data.apiBaseUrl);
      console.log("Loaded API base URL:", data.apiBaseUrl);
    };

    loadConfig();
  }, []);


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
    <div className="
      flex min-h-screen items-center justify-center 
      bg-gradient-to-br from-[#2a1e16] to-[#0f0a05]
      font-sans">
      <main className="
        flex w-full max-w-4xl flex-col items-center justify-between gap-y-6
        py-32 px-16 
        bg-[#1e293b]/70 dark:bg-[#2a2420]/85
        backdrop-blur-md 
        shadow-2xl rounded-3xl 
        border border-zinc-800/40
        sm:items-start">
      <ActionBar onFeed={handleFeedNow} onFlash={handleFlashLights} />
      <FeedingTimesView items={feedingTimes} onAdd={handleAdd} onUpdate={handleUpdate} onDelete={handleDelete} />
      <LogList items={logEntries} />
      </main>
    </div>
  );
}
