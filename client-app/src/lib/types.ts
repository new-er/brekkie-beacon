

export type FeedingTime = {
  id: string;
  name : string;
  time: string;
};


export type LogEntry = {
  id: number;
  timeStamp: string;
  level : string;
  renderedMessage: string;
  properties : string;
};

