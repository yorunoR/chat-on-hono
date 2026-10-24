import { upgradeWebSocket } from "@hono/node-server";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { runNormalChat } from "../../../apps/normal_chat/normal-chat-controller.js";
import { db } from "../../../db/index.js";
import { chatSessions } from "../../../db/schema/index.js";
import { env } from "../../../env.js";

// 会話はパスの chat_sessions.uid で判別し、存在しなければ upgrade せず 404 を返す
export const normalChat = new Hono().get("/:sessionUid", async (c) => {
  // upgradeWebSocket(c, events) は upgrade でないリクエストで例外を投げるため、先に弾く
  if (c.req.header("upgrade")?.toLowerCase() !== "websocket") {
    throw new HTTPException(404);
  }

  const [chatSession] = await db
    .select()
    .from(chatSessions)
    .where(eq(chatSessions.uid, c.req.param("sessionUid")))
    .limit(1);
  if (!chatSession) throw new HTTPException(404);

  // 切断・タイムアウトで回答の生成を止める
  const controller = new AbortController();
  let timer: NodeJS.Timeout | undefined;
  let started = false;

  return upgradeWebSocket(c, {
    onOpen(_event, ws) {
      timer = setTimeout(() => {
        controller.abort();
        ws.close(1000, "timeout");
      }, env.WS_TIMEOUT_SECONDS * 1000);
    },
    onMessage(event, ws) {
      // チャットはテキストのみ扱い、バイナリは無視する
      if (typeof event.data !== "string") return;
      // 1 接続で受け付ける質問は 1 つ。接続を閉じるのはクライアントの責務なので、以降の受信は捨てて閉じられるまで待つ
      if (started) return;
      started = true;
      runNormalChat(ws, chatSession, event.data, {
        signal: controller.signal,
      }).catch((err) => {
        // こちらから止めた場合は、接続はすでに閉じているか閉じるところ
        if (controller.signal.aborted) return;
        console.error("normal_chat failed", err);
        ws.close(1011);
      });
    },
    onClose() {
      clearTimeout(timer);
      controller.abort();
    },
  });
});
