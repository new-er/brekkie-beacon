import type { FeedingTime, LogEntry } from "./types";

export function setClientApiBaseUrl(url: string) {
  CLIENT_API_BASE_URL = url;
}
var CLIENT_API_BASE_URL : string|null = null; 

function getApiBaseUrl() {
  if (CLIENT_API_BASE_URL) return CLIENT_API_BASE_URL;
  const nextApiBaseUrl = process.env.API_BASE_URL;
  if (nextApiBaseUrl) return nextApiBaseUrl;
  throw new Error("API base URL is not configured");
}

// Feeding times
export async function fetchFeedingTimes(): Promise<FeedingTime[]> {
  const res = await fetch(
    `${getApiBaseUrl()}/feeding_times`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch feeding times");
  return res.json();
}

export async function fetchFeedingTime(id: string): Promise<FeedingTime> {
  const res = await fetch(
    `${getApiBaseUrl()}/feeding_times/${id}`
  );

  if (!res.ok) throw new Error("Failed to fetch feeding time");
  return res.json();
}

export async function createFeedingTime(
  feedingTime: Omit<FeedingTime, "id">
): Promise<FeedingTime> {
  const res = await fetch(
    `${getApiBaseUrl()}/feeding_times`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedingTime),
    }
  );
  if (!res.ok) throw new Error("Failed to create feeding time");
  return res.json();
}

export async function updateFeedingTime(
  id: string,
  feedingTime: Partial<FeedingTime>
): Promise<FeedingTime> {
  const res = await fetch(
    `${getApiBaseUrl()}/feeding_times/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedingTime),
    }
  );
  if (!res.ok) throw new Error("Failed to update feeding time");
  return res.json();
}

export async function deleteFeedingTime(id: string): Promise<void> {
  const res = await fetch(
    `${getApiBaseUrl()}/feeding_times/${id}`,
    { method: "DELETE" }
  );

  if (!res.ok) throw new Error("Failed to delete feeding time");
}

// Log entries
export async function fetchLogEntries(): Promise<LogEntry[]> {
  const res = await fetch(
    `${getApiBaseUrl()}/logs`,
    { cache: "no-store" }
  );
  
  if (!res.ok) throw new Error("Failed to fetch log messages");
  return res.json();
}

// Feed now
export async function feedNow(): Promise<void> {
  const res = await fetch(
    `${getApiBaseUrl()}/feed_now`,
    { method: "POST" }
  );

  if (!res.ok) throw new Error("Failed to feed now");
}


// Flash lights
export async function flashLights(): Promise<void> {
  const res = await fetch(
    `${getApiBaseUrl()}/flash_lights`,
    { method: "POST" }
  );
  
  if (!res.ok) throw new Error("Failed to flash lights");
}
