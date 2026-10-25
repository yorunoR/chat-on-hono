import { serve } from "@hono/node-server";
import { WebSocketServer } from "ws";
import { app } from "./entrypoints/app.js";
import { env } from "./env.js";
import { waitBackgroundTasks } from "./libs/tasks/background-task.js";

const server = serve(
  {
    fetch: app.fetch,
    port: env.PORT,
    websocket: { server: new WebSocketServer({ noServer: true }) },
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

// 切り離した後処理を、終了時に途中で捨てないよう待ってから終了する
async function shutdown(signal: NodeJS.Signals): Promise<void> {
  console.log(`${signal} received, shutting down`);
  server.close();
  await waitBackgroundTasks(
    env.BACKGROUND_TASK_SHUTDOWN_TIMEOUT_SECONDS * 1000,
  );
  process.exit(0);
}
process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);
