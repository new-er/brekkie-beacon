"use client";
import ActionBar from "./components/action_bar/ActionBar";
import FeedingTimesView from "./components/feeding_times/FeedingTimesView";
import LogList from "./components/log_messages/LogList";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import type { FeedingTime, LogEntry } from "@/lib/types";
import { setClientApiBaseUrl } from "@/lib/api";

export default function Home() {
  const [feedingTimes, setFeedingTimes] = useState<FeedingTime[]>([]);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [motorRunning, setMotorRunning] = useState(false);
  const [lightsFlashing, setLightsFlashing] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      const res = await fetch("/api/config");
      const data = await res.json();
      setClientApiBaseUrl(data.apiBaseUrl);
      setApiBaseUrl(data.apiBaseUrl);
      console.log("Loaded API base URL:", data.apiBaseUrl);
    };

    loadConfig();
  }, []);


  useEffect(() => {
    async function load() {
      try {
        var data = await api.feedingTimes.list();
        setFeedingTimes(data);
      } catch (error) {
        console.error("Error fetching feeding times:", error);
      }
    }
    load();
  }, [apiBaseUrl]);

  useEffect(() => {
    async function loadLogs() {
      try {
        var logs = await api.logs.list();
        setLogEntries(logs);
      } catch (error) {
        console.error("Error fetching log entries:", error);
      }
    }
    loadLogs();
  }, [apiBaseUrl]);

  useEffect(() => {
    async function checkMotorStatus() {
      try {
        const status = await api.motor.status();
        setMotorRunning(status.isRunning);
      } catch (error) {
        console.error("Error checking motor status:", error);
      }
    }

    async function checkLightsStatus() {
      try {
        const status = await api.lights.status();
        setLightsFlashing(status.isRunning);
      } catch (error) {
        console.error("Error checking lights status:", error);
      }
    }

    checkMotorStatus();
    checkLightsStatus();

    const interval = setInterval(() => {
      checkMotorStatus();
      checkLightsStatus();
    }, 200);

    return () => clearInterval(interval);
  }, [apiBaseUrl]);

  function handleAdd(time: FeedingTime) {
    api.feedingTimes.create(time);
    setFeedingTimes([...feedingTimes, time]);
  }

  function handleUpdate(updated: FeedingTime) {
    api.feedingTimes.update(updated.id, updated);
    setFeedingTimes(feedingTimes.map(ft => ft.id === updated.id ? updated : ft));
    console.log("Updated feeding time:", updated);
  }

  function handleDelete(id: string) {
    api.feedingTimes.delete(id);
    setFeedingTimes(feedingTimes.filter(ft => ft.id !== id));
    console.log("Deleted feeding time with id:", id);
  }

  function handleFeedNow() {
    api.motor.feed();
    console.log("Fed the cat immediately!");
  }

  function handleFlashLights() {
    api.lights.flash();
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
      <ActionBar onFeed={handleFeedNow} onFlash={handleFlashLights} isMotorRunning={motorRunning} isLightsFlashing={lightsFlashing} />
      <FeedingTimesView items={feedingTimes} onAdd={handleAdd} onUpdate={handleUpdate} onDelete={handleDelete} />
      <LogList items={logEntries} />
      </main>
    </div>
  );
}
