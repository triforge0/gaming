export class InteractPrompt {
  private readonly root: HTMLDivElement;

  constructor() {
    this.root = document.createElement('div');
    this.root.style.cssText =
      'position:absolute;left:50%;bottom:72px;transform:translateX(-50%);padding:10px 16px;' +
      'border-radius:8px;background:rgba(255,209,102,0.15);border:1px solid #ffd166;color:#ffd166;' +
      'font:14px monospace;z-index:20;display:none;pointer-events:none;';
    document.body.appendChild(this.root);
  }

  show(checkpointId: string): void {
    this.root.textContent = `[ E ] Open quiz at ${checkpointId}`;
    this.root.style.display = 'block';
  }

  hide(): void {
    this.root.style.display = 'none';
  }

  destroy(): void {
    this.root.remove();
  }
}
