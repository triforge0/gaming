// src/presence.ts
const SESSION_KEY = 'triforge.sudokucube.session';

function sessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/** Heartbeat presence — thất bại thì im lặng (server có thể không chạy khi dev). */
export function startPresenceHeartbeat(appId = 'sudokucube', intervalMs = 25_000): () => void {
  async function beat(): Promise<void> {
    if (document.hidden) return;
    try {
      await fetch(`/api/presence/${appId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionId() }),
      });
    } catch {
      // server offline — bỏ qua
    }
  }
  void beat();
  const timer = setInterval(beat, intervalMs);
  const onVisible = () => { if (!document.hidden) void beat(); };
  document.addEventListener('visibilitychange', onVisible);
  return () => {
    clearInterval(timer);
    document.removeEventListener('visibilitychange', onVisible);
  };
}
