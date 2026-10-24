// /ws/normal_chat/<sessionUid> にメッセージを 1 回送り、返ってきたエコーを表示する。
// サーバーは 1 回の送信に ECHO_COUNT 回エコーを返すので、その件数を受け取ったら切断する。
// 使い方: pnpm session:normal-chat <sessionUid> [メッセージ]
// 接続先の基点は WS_URL で変更できる (既定: ws://localhost:3000/ws/normal_chat)

import { ECHO_COUNT } from "../../entrypoints/routes/normal_chat/normal-chat.js";

const TIMEOUT_MS = 5000;

const [sessionUid, message = "hello"] = process.argv.slice(2);
if (!sessionUid) {
  console.error("Usage: pnpm session:normal-chat <sessionUid> [message]");
  process.exit(1);
}

const baseUrl = process.env.WS_URL ?? "ws://localhost:3000/ws/normal_chat";
const url = `${baseUrl}/${encodeURIComponent(sessionUid)}`;

const ws = new WebSocket(url);
let received = 0;

// ECHO_COUNT 件届かないままサーバーが黙った場合に終了できるようにする
const timer = setTimeout(() => {
  console.error(
    `タイムアウト: ${TIMEOUT_MS}ms 以内に ${ECHO_COUNT} 件受信できませんでした (${received} 件受信)`,
  );
  process.exitCode = 1;
  ws.close();
}, TIMEOUT_MS);

ws.addEventListener("open", () => {
  console.log(`connected: ${url}`);
  console.log(`send: ${message}`);
  ws.send(message);
});

ws.addEventListener("message", (event) => {
  received++;
  console.log(`recv ${received}: ${event.data}`);
  if (received >= ECHO_COUNT) ws.close();
});

ws.addEventListener("close", () => {
  clearTimeout(timer);
});

ws.addEventListener("error", () => {
  console.error(`接続エラー: ${url}`);
  process.exitCode = 1;
  clearTimeout(timer);
});
