import {
  GameClient,
  IHintReveal,
  IQuizPrompt,
  IQuizQuestionProto,
  IQuizResult,
  QuizOutcome,
  toNum,
} from '@triforge/shared-ui';

type SubmitHandler = (answers: Array<{ questionId: string; selectedIndex: number }>) => void;

export class QuizOverlay {
  private readonly backdrop: HTMLDivElement;
  private readonly panel: HTMLDivElement;
  private readonly titleEl: HTMLHeadingElement;
  private readonly timerEl: HTMLDivElement;
  private readonly bodyEl: HTMLDivElement;
  private readonly footerEl: HTMLDivElement;

  private prompt?: IQuizPrompt;
  private onSubmit?: SubmitHandler;
  private selections = new Map<string, number>();
  private open = false;

  constructor(private readonly client: GameClient) {
    this.backdrop = document.createElement('div');
    this.backdrop.style.cssText =
      'position:absolute;inset:0;background:rgba(0,0,0,0.72);display:none;z-index:30;';

    this.panel = document.createElement('div');
    this.panel.style.cssText =
      'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(680px,92vw);' +
      'max-height:88vh;overflow:auto;padding:20px;border-radius:12px;background:#16161d;' +
      'border:1px solid #333;color:#eee;font-family:monospace;';

    this.titleEl = document.createElement('h2');
    this.titleEl.style.cssText = 'margin:0 0 8px;font-size:18px;color:#ffd166;';

    this.timerEl = document.createElement('div');
    this.timerEl.style.cssText = 'margin-bottom:14px;font-size:13px;color:#aaa;';

    this.bodyEl = document.createElement('div');
    this.footerEl = document.createElement('div');
    this.footerEl.style.cssText = 'margin-top:16px;display:flex;gap:10px;justify-content:flex-end;';

    this.panel.append(this.titleEl, this.timerEl, this.bodyEl, this.footerEl);
    this.backdrop.appendChild(this.panel);
    document.body.appendChild(this.backdrop);
  }

  isOpen(): boolean {
    return this.open;
  }

  openPrompt(prompt: IQuizPrompt, onSubmit: SubmitHandler): void {
    this.prompt = prompt;
    this.onSubmit = onSubmit;
    this.selections.clear();
    this.open = true;
    this.backdrop.style.display = 'block';

    const checkpointId = prompt.checkpointId ?? 'checkpoint';
    this.titleEl.textContent = `Quiz · ${checkpointId}`;
    this.renderQuestions(prompt.questions ?? []);
    this.renderSubmitFooter();
    this.refreshTimer();
  }

  updateTimer(): void {
    if (!this.open || !this.prompt) {
      return;
    }
    this.refreshTimer();
  }

  showResult(result: IQuizResult): void {
    const passed = (result.outcome ?? QuizOutcome.QUIZ_PENDING) === QuizOutcome.QUIZ_PASS;
    const correct = toNum(result.correctCount);
    const total = toNum(result.totalQuestions);
    const earned = toNum(result.pointsEarned);
    const totalScore = toNum(result.totalScore);

    this.bodyEl.replaceChildren();
    this.footerEl.replaceChildren();

    const summary = document.createElement('div');
    summary.style.cssText = 'font-size:15px;line-height:1.6;';
    summary.innerHTML = passed
      ? `<strong style="color:#35c759">Passed!</strong><br/>${correct}/${total} correct · +${earned} pts · total ${totalScore}`
      : `<strong style="color:#ff6b6b">Failed</strong><br/>${correct}/${total} correct · try again at the checkpoint`;
    this.bodyEl.appendChild(summary);

    const continueBtn = this.button('Continue', () => this.close());
    this.footerEl.appendChild(continueBtn);
  }

  showHint(hint: IHintReveal): void {
    const block = document.createElement('div');
    block.style.cssText =
      'margin-top:14px;padding:12px;border-radius:8px;background:#1f1f28;border:1px solid #444;';
    const title = document.createElement('div');
    title.textContent = 'Next hint';
    title.style.cssText = 'color:#ffd166;margin-bottom:6px;font-size:13px;';
    const text = document.createElement('div');
    text.textContent = hint.text ?? '';
    text.style.cssText = 'font-size:14px;line-height:1.5;color:#ddd;';
    block.append(title, text);

    const nextIds = hint.nextCheckpointIds ?? [];
    if (nextIds.length > 0) {
      const routes = document.createElement('div');
      routes.textContent = `Routes: ${nextIds.join(', ')}`;
      routes.style.cssText = 'margin-top:8px;font-size:12px;color:#888;';
      block.appendChild(routes);
    }

    this.bodyEl.appendChild(block);
  }

  close(): void {
    this.open = false;
    this.prompt = undefined;
    this.onSubmit = undefined;
    this.selections.clear();
    this.backdrop.style.display = 'none';
    this.bodyEl.replaceChildren();
    this.footerEl.replaceChildren();
  }

  destroy(): void {
    this.close();
    this.backdrop.remove();
  }

  private renderQuestions(questions: IQuizQuestionProto[]): void {
    this.bodyEl.replaceChildren();
    questions.forEach((question, index) => {
      const questionId = question.questionId ?? `q${index}`;
      const wrap = document.createElement('div');
      wrap.style.cssText = 'margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #2a2a32;';

      const label = document.createElement('div');
      label.textContent = `${index + 1}. ${question.text ?? ''}`;
      label.style.cssText = 'margin-bottom:8px;font-size:14px;color:#fff;';
      wrap.appendChild(label);

      (question.options ?? []).forEach((option, optionIndex) => {
        const row = document.createElement('label');
        row.style.cssText =
          'display:flex;align-items:center;gap:8px;margin:6px 0;cursor:pointer;font-size:13px;color:#ccc;';
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `quiz-${questionId}`;
        input.value = String(optionIndex);
        input.onchange = () => this.selections.set(questionId, optionIndex);
        row.append(input, document.createTextNode(option));
        wrap.appendChild(row);
      });

      this.bodyEl.appendChild(wrap);
    });
  }

  private renderSubmitFooter(): void {
    this.footerEl.replaceChildren();
    const submit = this.button('Submit answers', () => this.submitAnswers());
    this.footerEl.appendChild(submit);
  }

  private submitAnswers(): void {
    if (!this.prompt || !this.onSubmit) {
      return;
    }
    const questions = this.prompt.questions ?? [];
    const answers: Array<{ questionId: string; selectedIndex: number }> = [];
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const questionId = question.questionId ?? `q${i}`;
      const selectedIndex = this.selections.get(questionId);
      if (selectedIndex == null) {
        this.timerEl.textContent = 'Select an answer for every question before submitting.';
        this.timerEl.style.color = '#ff6b6b';
        return;
      }
      answers.push({ questionId, selectedIndex });
    }
    this.onSubmit(answers);
    this.footerEl.replaceChildren();
    const waiting = document.createElement('span');
    waiting.textContent = 'Submitting…';
    waiting.style.color = '#888';
    this.footerEl.appendChild(waiting);
  }

  private refreshTimer(): void {
    if (!this.prompt) {
      return;
    }
    const deadlineTick = toNum(this.prompt.deadlineTick);
    const remainingTicks = Math.max(0, deadlineTick - this.client.lastServerTick);
    const seconds = Math.ceil(remainingTicks / this.client.serverTps);
    this.timerEl.style.color = seconds <= 5 ? '#ff6b6b' : '#aaa';
    this.timerEl.textContent = `Time left: ${seconds}s · need ${toNum(this.prompt.passThreshold)} pts to pass`;
  }

  private button(label: string, onClick: () => void): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.style.cssText =
      'padding:8px 14px;border:1px solid #555;border-radius:8px;background:#252530;color:#eee;cursor:pointer;font-family:monospace;';
    btn.onclick = onClick;
    return btn;
  }
}
