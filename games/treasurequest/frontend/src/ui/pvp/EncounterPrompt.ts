import { GameClient, IEncounterOffer, toNum } from '@triforge/shared-ui';

type ResponseHandler = (accept: boolean) => void;

export class EncounterPrompt {
  private readonly root: HTMLDivElement;
  private readonly titleEl: HTMLDivElement;
  private readonly timerEl: HTMLDivElement;
  private readonly actionsEl: HTMLDivElement;

  private offer?: IEncounterOffer;
  private onRespond?: ResponseHandler;
  private visible = false;

  constructor(private readonly client: GameClient) {
    this.root = document.createElement('div');
    this.root.style.cssText =
      'position:absolute;left:50%;bottom:72px;transform:translateX(-50%);width:min(420px,92vw);' +
      'padding:14px 16px;border-radius:10px;background:rgba(22,22,29,0.96);border:1px solid #ff6b6b;' +
      'color:#eee;font-family:monospace;z-index:25;display:none;';

    this.titleEl = document.createElement('div');
    this.titleEl.style.cssText = 'font-size:15px;color:#ff8787;margin-bottom:6px;';

    this.timerEl = document.createElement('div');
    this.timerEl.style.cssText = 'font-size:12px;color:#aaa;margin-bottom:12px;';

    this.actionsEl = document.createElement('div');
    this.actionsEl.style.cssText = 'display:flex;gap:10px;justify-content:flex-end;';

    this.root.append(this.titleEl, this.timerEl, this.actionsEl);
    document.body.appendChild(this.root);
  }

  isVisible(): boolean {
    return this.visible;
  }

  show(offer: IEncounterOffer, onRespond: ResponseHandler): void {
    this.offer = offer;
    this.onRespond = onRespond;
    this.visible = true;
    this.root.style.display = 'block';

    const opponent = offer.opponentName ?? `Player ${toNum(offer.opponentPlayerId)}`;
    this.titleEl.textContent = `Challenge from ${opponent}`;
    this.renderActions();
    this.refreshTimer();
  }

  updateTimer(): void {
    if (!this.visible) {
      return;
    }
    this.refreshTimer();
  }

  hide(): void {
    this.visible = false;
    this.offer = undefined;
    this.onRespond = undefined;
    this.root.style.display = 'none';
    this.actionsEl.replaceChildren();
  }

  destroy(): void {
    this.hide();
    this.root.remove();
  }

  private renderActions(): void {
    this.actionsEl.replaceChildren();
    this.actionsEl.append(
      this.button('Decline', '#444', () => this.respond(false)),
      this.button('Accept duel', '#ff6b6b', () => this.respond(true)),
    );
  }

  private respond(accept: boolean): void {
    this.onRespond?.(accept);
    if (!accept) {
      this.hide();
    } else {
      this.titleEl.textContent = 'Waiting for opponent…';
      this.timerEl.textContent = '';
      this.actionsEl.replaceChildren();
    }
  }

  private refreshTimer(): void {
    if (!this.offer) {
      return;
    }
    const deadlineTick = toNum(this.offer.deadlineTick);
    const remainingTicks = Math.max(0, deadlineTick - this.client.lastServerTick);
    const seconds = Math.ceil(remainingTicks / this.client.serverTps);
    this.timerEl.style.color = seconds <= 3 ? '#ff6b6b' : '#aaa';
    this.timerEl.textContent = `Respond within ${seconds}s · winner steals 20% of loser's score`;
  }

  private button(label: string, bg: string, onClick: () => void): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.style.cssText =
      `padding:8px 14px;border:1px solid #555;border-radius:8px;background:${bg};` +
      'color:#eee;cursor:pointer;font-family:monospace;';
    btn.onclick = onClick;
    return btn;
  }
}
