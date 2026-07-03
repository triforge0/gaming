import type { GameClient, IChatMessage } from '../net/client';
import { toNum } from '../net/client';
import {
  playChatReceiveSound,
  playChatSendSound,
  playChatSystemSound,
  primeChatSounds,
} from './chatSounds';

const MAX_LINES = 100;

export interface ChatOverlayOptions {
  /** Play send/receive/system cues (default true). */
  sounds?: boolean;
  /**
   * Pin chat to the viewport corner so game canvases / HUD layers cannot cover it
   * (default true).
   */
  fixed?: boolean;
}

/**
 * Vanilla DOM chat overlay: scrollable log + input. Mount once per room connection so it
 * survives scene / view transitions.
 */
export class ChatOverlay {
  private static focusedInput: HTMLInputElement | null = null;
  private static readonly byClient = new WeakMap<GameClient, ChatOverlay>();

  private readonly root: HTMLDivElement;
  private readonly log: HTMLDivElement;
  private readonly input: HTMLInputElement;
  private readonly unsubscribe: () => void;
  private lineCount = 0;
  private lastLineKey = '';
  private readonly soundsEnabled: boolean;
  private readonly mountTarget: HTMLElement;
  private readonly emptyHint: HTMLParagraphElement;

  constructor(
    private readonly client: GameClient,
    container: HTMLElement,
    options: ChatOverlayOptions = {},
  ) {
    ChatOverlay.byClient.get(client)?.destroy();

    this.soundsEnabled = options.sounds !== false;
    const useFixed = options.fixed !== false;
    this.mountTarget = useFixed ? document.body : container;

    this.root = document.createElement('div');
    this.root.className = 'tf-chat-overlay';
    this.root.setAttribute('role', 'region');
    this.root.setAttribute('aria-label', 'Room chat');
    this.root.innerHTML = `
      <style>
        .tf-chat-overlay {
          position: ${useFixed ? 'fixed' : 'absolute'};
          left: 12px;
          bottom: 12px;
          width: min(340px, calc(100vw - 24px));
          display: flex;
          flex-direction: column;
          gap: 6px;
          pointer-events: auto;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 12px;
          z-index: 100000;
          filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.45));
        }
        .tf-chat-header {
          margin: 0;
          padding: 4px 8px;
          border-radius: 6px;
          background: rgba(12, 16, 28, 0.92);
          border: 1px solid rgba(120, 180, 255, 0.35);
          color: #c5ddff;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .tf-chat-log {
          min-height: 72px;
          max-height: 180px;
          overflow-y: auto;
          padding: 8px;
          border-radius: 8px;
          background: rgba(8, 10, 16, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #e8ecf4;
          line-height: 1.35;
        }
        .tf-chat-empty {
          margin: 0;
          color: #7a8499;
          font-style: italic;
        }
        .tf-chat-line { margin: 0 0 4px; word-break: break-word; }
        .tf-chat-line--system { color: #9aa3b5; font-style: italic; }
        .tf-chat-line--self { color: #b8e0ff; }
        .tf-chat-input {
          width: 100%;
          box-sizing: border-box;
          padding: 9px 11px;
          border-radius: 8px;
          border: 1px solid rgba(120, 180, 255, 0.35);
          background: rgba(8, 10, 16, 0.96);
          color: #fff;
          outline: none;
        }
        .tf-chat-input::placeholder { color: #8b93a7; }
        .tf-chat-input:focus {
          border-color: rgba(120, 180, 255, 0.75);
          box-shadow: 0 0 0 2px rgba(120, 180, 255, 0.2);
        }
      </style>
    `;

    const header = document.createElement('p');
    header.className = 'tf-chat-header';
    header.textContent = 'Room chat';

    this.log = document.createElement('div');
    this.log.className = 'tf-chat-log';
    this.log.setAttribute('aria-live', 'polite');

    this.emptyHint = document.createElement('p');
    this.emptyHint.className = 'tf-chat-empty';
    this.emptyHint.textContent = 'Messages appear here. Press Enter to send.';
    this.log.appendChild(this.emptyHint);

    this.input = document.createElement('input');
    this.input.className = 'tf-chat-input';
    this.input.type = 'text';
    this.input.maxLength = 200;
    this.input.placeholder = 'Chat (Enter to send)';
    this.input.autocomplete = 'off';
    this.input.addEventListener('focus', () => {
      ChatOverlay.focusedInput = this.input;
      if (this.soundsEnabled) {
        primeChatSounds();
      }
    });
    this.input.addEventListener('blur', () => {
      if (ChatOverlay.focusedInput === this.input) {
        ChatOverlay.focusedInput = null;
      }
    });
    this.input.addEventListener('keydown', (event) => {
      event.stopPropagation();
      if (event.key === 'Enter') {
        event.preventDefault();
        this.submit();
      }
    });

    this.root.append(header, this.log, this.input);
    if (!useFixed) {
      container.style.position = container.style.position || 'relative';
    }
    this.mountTarget.appendChild(this.root);

    this.unsubscribe = this.client.onChat((message) => this.appendLine(message));
    ChatOverlay.byClient.set(this.client, this);
  }

  static isInputFocused(): boolean {
    return ChatOverlay.focusedInput !== null
      && document.activeElement === ChatOverlay.focusedInput;
  }

  destroy(): void {
    if (ChatOverlay.byClient.get(this.client) === this) {
      ChatOverlay.byClient.delete(this.client);
    }
    this.unsubscribe();
    this.root.remove();
    if (ChatOverlay.focusedInput === this.input) {
      ChatOverlay.focusedInput = null;
    }
  }

  private submit(): void {
    const text = this.input.value.trim();
    if (!text) {
      return;
    }
    this.client.sendChat(text);
    this.input.value = '';
    if (this.soundsEnabled) {
      playChatSendSound();
    }
  }

  private appendLine(message: IChatMessage): void {
    const lineKey = `${toNum(message.senderPlayerId)}|${toNum(message.tick)}|${message.text ?? ''}`;
    if (lineKey === this.lastLineKey) {
      return;
    }
    this.lastLineKey = lineKey;

    const senderId = toNum(message.senderPlayerId);
    const isSystem = senderId === 0;
    const isSelf = senderId > 0 && senderId === this.client.selfPlayerId;

    if (this.soundsEnabled) {
      if (isSystem) {
        playChatSystemSound();
      } else if (!isSelf) {
        playChatReceiveSound();
      }
    }

    const line = document.createElement('p');
    line.className = 'tf-chat-line'
      + (isSystem ? ' tf-chat-line--system' : '')
      + (isSelf ? ' tf-chat-line--self' : '');

    if (isSystem) {
      line.textContent = message.text ?? '';
    } else {
      line.textContent = `${message.senderName ?? 'Player'}: ${message.text ?? ''}`;
    }

    if (this.emptyHint.isConnected) {
      this.emptyHint.remove();
    }

    this.log.appendChild(line);
    this.lineCount += 1;
    while (this.lineCount > MAX_LINES) {
      const first = this.log.firstElementChild;
      if (!first) {
        break;
      }
      first.remove();
      this.lineCount -= 1;
    }
    this.log.scrollTop = this.log.scrollHeight;
  }
}
