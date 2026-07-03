import { ILeaderboard, ILeaderboardEntry, toNum } from '@triforge/shared-ui';

export class LeaderboardPanel {
  private readonly root: HTMLDivElement;
  private readonly titleEl: HTMLDivElement;
  private readonly tableEl: HTMLTableElement;

  constructor() {
    this.root = document.createElement('div');
    this.root.style.cssText =
      'position:absolute;top:8px;right:8px;width:min(280px,42vw);padding:8px 10px;border-radius:8px;' +
      'background:rgba(0,0,0,0.72);color:#eee;font:12px/1.35 monospace;z-index:20;';

    this.titleEl = document.createElement('div');
    this.titleEl.style.cssText = 'font-size:13px;color:#ffd166;margin-bottom:6px;';

    this.tableEl = document.createElement('table');
    this.tableEl.style.cssText = 'width:100%;border-collapse:collapse;';

    this.root.append(this.titleEl, this.tableEl);
    document.body.appendChild(this.root);
    this.renderEmpty();
  }

  update(leaderboard: ILeaderboard | null | undefined, selfPlayerId: number): void {
    const entries = leaderboard?.entries ?? [];
    const finalStandings = leaderboard?.finalStandings ?? false;
    this.titleEl.textContent = finalStandings ? 'Final standings' : 'Leaderboard';

    if (entries.length === 0) {
      this.renderEmpty();
      return;
    }

    this.tableEl.replaceChildren();
    const head = document.createElement('thead');
    const headRow = document.createElement('tr');
    for (const label of ['#', 'Explorer', 'PWR', 'SC', 'CP']) {
      const th = document.createElement('th');
      th.textContent = label;
      th.style.cssText = 'text-align:left;color:#888;font-weight:normal;padding:2px 4px;';
      headRow.append(th);
    }
    head.append(headRow);
    this.tableEl.append(head);

    const body = document.createElement('tbody');
    for (const entry of entries) {
      body.append(this.row(entry, selfPlayerId, finalStandings));
    }
    this.tableEl.append(body);
  }

  destroy(): void {
    this.root.remove();
  }

  private renderEmpty(): void {
    this.titleEl.textContent = 'Leaderboard';
    this.tableEl.replaceChildren();
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 5;
    cell.textContent = 'Waiting for standings…';
    cell.style.cssText = 'color:#777;padding:4px 0;';
    row.append(cell);
    this.tableEl.append(row);
  }

  private row(entry: ILeaderboardEntry, selfPlayerId: number, finalStandings: boolean): HTMLTableRowElement {
    const tr = document.createElement('tr');
    const isSelf = toNum(entry.playerId) === selfPlayerId;
    const color = isSelf ? '#ffd166' : finalStandings && toNum(entry.rank) === 1 ? '#51cf66' : '#ddd';
    tr.style.color = color;

    const values = [
      String(entry.rank ?? '—'),
      entry.name ?? `P${toNum(entry.playerId)}`,
      String(entry.power ?? 0),
      String(entry.score ?? 0),
      String(entry.checkpointsCleared ?? 0),
    ];

    for (const value of values) {
      const td = document.createElement('td');
      td.textContent = value;
      td.style.cssText = 'padding:2px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:96px;';
      tr.append(td);
    }
    return tr;
  }
}

export function renderLeaderboardHtml(
  leaderboard: ILeaderboard | null | undefined,
  selfPlayerId: number,
): string {
  const entries = leaderboard?.entries ?? [];
  if (entries.length === 0) {
    return 'No standings recorded.';
  }
  const lines = entries.map((entry) => {
    const rank = entry.rank ?? '—';
    const name = entry.name ?? `P${toNum(entry.playerId)}`;
    const marker = toNum(entry.playerId) === selfPlayerId ? ' ◀' : '';
    return `${rank}. ${name}${marker} — PWR ${entry.power ?? 0} · SC ${entry.score ?? 0} · CP ${entry.checkpointsCleared ?? 0}`;
  });
  return lines.join('\n');
}
