async function fetchFeedingTimes(): Promise<FeedingTime[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/feeding_times`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch feeding times");
  }

  return res.json();
}

export { fetchFeedingTimes };

