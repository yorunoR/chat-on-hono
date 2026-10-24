import { upgradeWebSocket } from "@hono/node-server";
import { Hono } from "hono";

export const ECHO_COUNT = 3;

// クライアントからの 1 回の送信に対し、同じ内容を ECHO_COUNT 回返す
export const normalChat = new Hono().get(
  "/",
  upgradeWebSocket(() => ({
    onMessage(event, ws) {
      // チャットはテキストのみ扱い、バイナリは無視する
      if (typeof event.data !== "string") return;
      for (let i = 0; i < ECHO_COUNT; i++) {
        ws.send(event.data);
      }
    },
  })),
);
