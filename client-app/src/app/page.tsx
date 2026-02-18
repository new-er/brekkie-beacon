import Image from "next/image";
import FeedingTimeList from "./components/feeding_times/FeedingTimeList";
import LogList from "./components/log_messages/LogList";
import { fetchFeedingTimes } from "@/lib/api";

export default async function Home() {
  let feedingTimes: FeedingTime[] = [];
  feedingTimes = await fetchFeedingTimes();

  const mockLogMessages: LogMessage[] = [
    { id: "1", time: "2024-06-01T08:00:00Z", message: "Fed the cat in the morning." },
    { id: "2", time: "2024-06-01T18:00:00Z", message: "Fed the cat in the evening." },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <FeedingTimeList items={feedingTimes} />
      <LogList items={mockLogMessages} />
      </main>
    </div>
  );
}
