export interface QuestHudState {
  phaseLabel: string;
  matchSeconds: number;
  score: number;
  cleared: number;
  checkpoint: string;
  pingMs: number;
  shielded?: boolean;
  pvpCooldown?: boolean;
  stealImmune?: boolean;
}

export class QuestHud {
  private readonly root: HTMLDivElement;

  constructor() {
    this.root = document.createElement('div');
    this.root.style.cssText =
      'position:absolute;top:8px;left:8px;padding:8px 10px;border-radius:8px;' +
      'background:rgba(0,0,0,0.72);color:#eee;font:13px/1.45 monospace;pointer-events:none;' +
      'max-width:360px;white-space:pre-line;z-index:20;';
    document.body.appendChild(this.root);
  }

  update(state: QuestHudState): void {
    const badges: string[] = [];
    if (state.shielded) badges.push('shield');
    if (state.pvpCooldown) badges.push('pvp cd');
    if (state.stealImmune) badges.push('steal immune');
    const badgeLine = badges.length > 0 ? `\n${badges.join(' · ')}` : '';

    this.root.textContent =
      `${state.phaseLabel} · ${state.matchSeconds}s · ping ${state.pingMs}ms\n` +
      `Score ${state.score} · cleared ${state.cleared} · target ${state.checkpoint || '—'}${badgeLine}`;
  }

  destroy(): void {
    this.root.remove();
  }
}
