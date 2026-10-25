// 終了時に待つため、実行中のタスクを名前つきで持っておく
const backgroundTasks = new Map<Promise<void>, string>();

/** 接続やリクエストの寿命から切り離して実行する。例外はログに出す */
export function runInBackground(
  fn: () => Promise<unknown>,
  { name }: { name: string },
): void {
  const promise: Promise<void> = Promise.resolve()
    .then(fn)
    .then(
      () => {},
      (err) => console.error(`background task failed: ${name}`, err),
    )
    .finally(() => backgroundTasks.delete(promise));
  backgroundTasks.set(promise, name);
}

/**
 * 終了時に実行中のタスクを待つ。timeoutMs を過ぎたら待つのをやめ、残ったタスクをログに出す
 *
 * Promise は外から止められないため、残ったタスクはプロセスの終了とともに打ち切られる
 */
export async function waitBackgroundTasks(timeoutMs: number): Promise<void> {
  if (backgroundTasks.size === 0) return;
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<"timeout">((resolve) => {
    timer = setTimeout(() => resolve("timeout"), timeoutMs);
  });
  const result = await Promise.race([
    Promise.all(backgroundTasks.keys()),
    timeout,
  ]);
  clearTimeout(timer);
  if (result !== "timeout") return;
  for (const name of backgroundTasks.values()) {
    console.warn(`background task abandoned: ${name}`);
  }
}
