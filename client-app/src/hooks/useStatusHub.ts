import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

export function useStatusHub(apiBaseUrl: string, newLogEntryHandler: () => void) {
  const [motorRunning, setMotorRunning] = useState(false);
  const [lightsFlashing, setLightsFlashing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!apiBaseUrl) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiBaseUrl}/statusHub`)
      .withAutomaticReconnect()
      .build();

    connection.on("MotorStatusChanged", (status: { isRunning: boolean }) => {
      setMotorRunning(status.isRunning);
    });

    connection.on("LedStatusChanged", (status: { isRunning: boolean }) => {
      setLightsFlashing(status.isRunning);
    });

    connection.on("NewLogMessage", () => {
      newLogEntryHandler();
    });

    connection.start()
      .then(() => setIsConnected(true))
      .catch(console.error);

    return () => { connection.stop(); };
  }, [apiBaseUrl]);

  return { motorRunning, lightsFlashing, isConnected };
}
