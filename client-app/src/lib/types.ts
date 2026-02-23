export type FeedingTime = {
  id: string;
  name: string;
  time: string;

  motorInstructions: MotorInstructions;
  ledInstructions: LEDInstructions;
};

export type MotorInstructions = {
  steps: number;
  waitBetweenSteps: string;
  negateDirection: boolean;
}

export type LEDInstructions = {
  brightness: number;
}


export type LogEntry = {
  id: number;
  timeStamp: string;
  level: string;
  renderedMessage: string;
  properties: string;
};

