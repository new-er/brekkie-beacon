

export type FeedingTime = {
  id: string;
  name : string;
  time: string;
};


export type LogMessage = {
  id: string;
  time: string;
  message : string;
  level : "info" | "warning" | "error";
};

