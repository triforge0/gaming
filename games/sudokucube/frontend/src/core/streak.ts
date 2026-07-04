const DAY_MS = 86_400_000;
const KEEP = 30;

export function recordPlayDate(dates: string[], today: string): string[] {
  return [...new Set([...dates, today])].sort().slice(-KEEP);
}

export function currentStreak(dates: string[], today: string): number {
  const set = new Set(dates);
  let streak = 0;
  let t = Date.parse(today + 'T00:00:00Z');
  while (set.has(new Date(t).toISOString().slice(0, 10))) {
    streak++;
    t -= DAY_MS;
  }
  return streak;
}
