import Image from "next/image";
import FeedingTimeList from "./components/feeding_times/FeedingTimeList";
import LogList from "./components/log_messages/LogList";

export default function Home() {
  const mockFeedingTimes: FeedingTime[] = [
    { id: "1", name: "morning", time: "05:00 AM" },
    { id: "2", name: "evening", time: "17:00 PM" },
  ];

  const mockLogMessages: LogMessage[] = [
    { id: "1", time: "2024-06-01T08:00:00Z", message: "Fed the cat in the morning." },
    { id: "2", time: "2024-06-01T18:00:00Z", message: "Fed the cat in the evening." },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <FeedingTimeList items={mockFeedingTimes} />
      <LogList items={mockLogMessages} />
      </main>
    </div>
  );
}
