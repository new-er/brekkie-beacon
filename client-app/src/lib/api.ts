import type { FeedingTime } from "./types";

export async function fetchFeedingTimes(): Promise<FeedingTime[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/feeding_times`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch feeding times");
  return res.json();
}

export async function fetchFeedingTime(id: string): Promise<FeedingTime> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/feeding_times/${id}`
  );

  if (!res.ok) throw new Error("Failed to fetch feeding time");
  return res.json();
}

export async function createFeedingTime(
  feedingTime: Omit<FeedingTime, "id">
): Promise<FeedingTime> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/feeding_times`,
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
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/feeding_times/${id}`,
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
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/feeding_times/${id}`,
    { method: "DELETE" }
  );

  if (!res.ok) throw new Error("Failed to delete feeding time");
}


export async function fetchLogEntries(): Promise<LogEntry[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/logs`,
    { cache: "no-store" }
  );
  
  if (!res.ok) throw new Error("Failed to fetch log messages");
  return res.json();
}
