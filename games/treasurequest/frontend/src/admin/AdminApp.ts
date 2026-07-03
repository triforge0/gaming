import { AdminApiError, adminGet, adminPut } from './api';
import type {
  CheckpointDef,
  CheckpointOverlay,
  ExpeditionConfigJson,
  QuizFile,
  QuizQuestion,
  QuizSet,
} from './types';
import { validateCheckpoints, validateConfig, validateQuizzes } from './validate';

type TabId = 'config' | 'quizzes' | 'checkpoints';

export class AdminApp {
  private readonly root: HTMLElement;
  private readonly statusEl: HTMLDivElement;
  private readonly tokenInput: HTMLInputElement;
  private readonly mapCanvas: HTMLCanvasElement;
  private readonly checkpointTableBody: HTMLTableSectionElement;
  private readonly configForm: HTMLDivElement;
  private readonly quizzesRoot: HTMLDivElement;
  private readonly checkpointsPanel: HTMLDivElement;
  private configInputs = new Map<keyof ExpeditionConfigJson, HTMLInputElement>();

  private config: ExpeditionConfigJson = {};
  private quizzes: QuizFile = { quizzes: [] };
  private checkpoints: CheckpointOverlay = {
    width: 20,
    height: 15,
    tileSize: 32,
    start: '',
    checkpoints: [],
    treasure: { x: 0, y: 0, w: 1, h: 1 },
  };

  constructor(mount: HTMLElement) {
    this.root = mount;
    this.statusEl = document.createElement('div');
    this.tokenInput = document.createElement('input');
    this.mapCanvas = document.createElement('canvas');
    this.checkpointTableBody = document.createElement('tbody');
    this.configForm = document.createElement('div');
    this.quizzesRoot = document.createElement('div');
    this.checkpointsPanel = document.createElement('div');
    this.mountUi();
  }

  private mountUi(): void {
    this.root.innerHTML = '';
    const header = document.createElement('header');
    header.className = 'admin-header';
    header.innerHTML = `
      <div>
        <h1>Treasure Quest Admin</h1>
        <a href="../">← Back to game</a>
      </div>
    `;

    this.tokenInput.type = 'password';
    this.tokenInput.placeholder = 'Admin token (optional)';
    this.tokenInput.value = localStorage.getItem('tq-admin-token') ?? '';

    const reloadBtn = document.createElement('button');
    reloadBtn.textContent = 'Reload';
    reloadBtn.onclick = () => void this.loadAll();

    const toolbar = document.createElement('div');
    toolbar.className = 'admin-toolbar';
    toolbar.append(this.tokenInput, reloadBtn);
    header.appendChild(toolbar);

    this.statusEl.className = 'status';

    const tabs = document.createElement('div');
    tabs.className = 'tabs';
    for (const tab of [
      ['config', 'Config'],
      ['quizzes', 'Quizzes'],
      ['checkpoints', 'Checkpoints'],
    ] as const) {
      const btn = document.createElement('button');
      btn.className = 'tab';
      btn.textContent = tab[1];
      btn.dataset.tab = tab[0];
      btn.onclick = () => this.switchTab(tab[0]);
      tabs.appendChild(btn);
    }

    this.configForm.className = 'panel';
    this.configForm.dataset.panel = 'config';

    this.quizzesRoot.className = 'panel';
    this.quizzesRoot.dataset.panel = 'quizzes';

    this.checkpointsPanel.className = 'panel';
    this.checkpointsPanel.dataset.panel = 'checkpoints';

    this.mapCanvas.className = 'map-preview';
    this.mapCanvas.width = 640;
    this.mapCanvas.height = 480;

    const addCheckpointBtn = document.createElement('button');
    addCheckpointBtn.textContent = 'Add checkpoint';
    addCheckpointBtn.onclick = () => {
      this.checkpoints.checkpoints.push(defaultCheckpoint(this.checkpoints.checkpoints.length + 1));
      this.renderCheckpointsPanel();
    };

    this.checkpointsPanel.append(
      this.fieldBlock('Start checkpoint id', this.makeStartSelect()),
      document.createElement('hr'),
      this.mapCanvas,
      document.createElement('br'),
      this.buildCheckpointSection(),
      addCheckpointBtn,
      this.panelActions('checkpoints'),
    );

    this.root.append(header, this.statusEl, tabs, this.configForm, this.quizzesRoot, this.checkpointsPanel);
    this.switchTab('config');
    void this.loadAll();
  }

  private switchTab(tab: TabId): void {
    for (const el of this.root.querySelectorAll<HTMLElement>('.tab')) {
      el.classList.toggle('active', el.dataset.tab === tab);
    }
    for (const el of this.root.querySelectorAll<HTMLElement>('.panel')) {
      el.classList.toggle('active', el.dataset.panel === tab);
    }
  }

  private token(): string {
    const value = this.tokenInput.value;
    localStorage.setItem('tq-admin-token', value);
    return value;
  }

  private async loadAll(): Promise<void> {
    this.setStatus('Loading…');
    try {
      this.config = await adminGet<ExpeditionConfigJson>('config', this.token());
      this.quizzes = await adminGet<QuizFile>('quizzes', this.token());
      this.checkpoints = await adminGet<CheckpointOverlay>('checkpoints', this.token());
      this.renderAll();
      this.setStatus('Loaded expedition content.', false);
    } catch (error) {
      this.setStatus(formatError(error), true);
    }
  }

  private renderAll(): void {
    this.renderConfigPanel();
    this.renderQuizzesPanel();
    this.renderCheckpointsPanel();
  }

  private renderConfigPanel(): void {
    this.configForm.replaceChildren();
    this.configInputs.clear();
    const fields: Array<[keyof ExpeditionConfigJson, string, number | undefined]> = [
      ['encounterRadiusTiles', 'Encounter radius (tiles)', this.config.encounterRadiusTiles],
      ['stealPct', 'Steal percent (0–1)', this.config.stealPct],
      ['pvpCooldownSecs', 'PvP cooldown (sec)', this.config.pvpCooldownSecs],
      ['stealImmunitySecs', 'Steal immunity (sec)', this.config.stealImmunitySecs],
      ['shieldSecs', 'Quiz shield (sec)', this.config.shieldSecs],
      ['duelQuestionCount', 'Duel question count', this.config.duelQuestionCount],
      ['duelTimeLimitSecs', 'Duel time limit (sec)', this.config.duelTimeLimitSecs],
      ['treasureLockSecs', 'Treasure lock (sec)', this.config.treasureLockSecs],
      ['powerKnowledgeWeight', 'Power/knowledge weight (0–1)', this.config.powerKnowledgeWeight],
    ];

    const grid = document.createElement('div');
    grid.className = 'grid-2';

    for (const [key, labelText, value] of fields) {
      const input = document.createElement('input');
      input.type = 'number';
      input.step = key === 'stealPct' || key === 'powerKnowledgeWeight' || key === 'encounterRadiusTiles'
        ? '0.01'
        : '1';
      input.value = value != null ? String(value) : '';
      this.configInputs.set(key, input);
      grid.appendChild(this.fieldBlock(labelText, input));
    }

    const saveBtn = document.createElement('button');
    saveBtn.className = 'primary';
    saveBtn.textContent = 'Save config';
    saveBtn.onclick = () => void this.saveConfigFromForm();

    this.configForm.append(grid, saveBtn);
  }

  private saveConfigFromForm(): void {
    const next: ExpeditionConfigJson = {};
    for (const [key, input] of this.configInputs) {
      const raw = input.value.trim();
      if (raw) {
        (next as Record<string, number>)[key] = Number(raw);
      }
    }
    void this.saveConfig(next);
  }

  private renderQuizzesPanel(): void {
    this.quizzesRoot.replaceChildren();

    const addQuizBtn = document.createElement('button');
    addQuizBtn.textContent = 'Add quiz';
    addQuizBtn.onclick = () => {
      this.quizzes.quizzes.push(defaultQuiz(this.quizzes.quizzes.length + 1));
      this.renderQuizzesPanel();
    };

    for (const quiz of this.quizzes.quizzes) {
      this.quizzesRoot.appendChild(this.renderQuizCard(quiz));
    }

    this.quizzesRoot.append(addQuizBtn, this.panelActions('quizzes'));
  }

  private renderQuizCard(quiz: QuizSet): HTMLElement {
    const card = document.createElement('div');
    card.className = 'card';

    const title = document.createElement('h3');
    title.textContent = `Quiz ${quiz.id || '(new)'}`;

    const idInput = document.createElement('input');
    idInput.value = quiz.id;
    idInput.oninput = () => {
      quiz.id = idInput.value.trim();
      title.textContent = `Quiz ${quiz.id || '(new)'}`;
    };

    const thresholdInput = document.createElement('input');
    thresholdInput.type = 'number';
    thresholdInput.value = String(quiz.passThreshold);
    thresholdInput.oninput = () => {
      quiz.passThreshold = Number(thresholdInput.value) || 0;
    };

    const removeBtn = document.createElement('button');
    removeBtn.className = 'danger';
    removeBtn.textContent = 'Remove quiz';
    removeBtn.onclick = () => {
      this.quizzes.quizzes = this.quizzes.quizzes.filter((item) => item !== quiz);
      this.renderQuizzesPanel();
    };

    card.append(
      title,
      this.fieldBlock('Quiz id', idInput),
      this.fieldBlock('Pass threshold (points)', thresholdInput),
      removeBtn,
    );

    for (const question of quiz.questions) {
      card.appendChild(this.renderQuestionEditor(quiz, question));
    }

    const addQuestionBtn = document.createElement('button');
    addQuestionBtn.textContent = 'Add question';
    addQuestionBtn.onclick = () => {
      quiz.questions.push(defaultQuestion(quiz.questions.length + 1));
      this.renderQuizzesPanel();
    };
    card.appendChild(addQuestionBtn);
    return card;
  }

  private renderQuestionEditor(quiz: QuizSet, question: QuizQuestion): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'card';

    const idInput = document.createElement('input');
    idInput.value = question.id;
    idInput.oninput = () => {
      question.id = idInput.value.trim();
    };

    const textInput = document.createElement('textarea');
    textInput.rows = 2;
    textInput.value = question.text;
    textInput.oninput = () => {
      question.text = textInput.value;
    };

    const optionsRoot = document.createElement('div');
    optionsRoot.className = 'options-list';

    const renderOptions = () => {
      optionsRoot.replaceChildren();
      question.options.forEach((option, index) => {
        const row = document.createElement('div');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `correct-${quiz.id}-${question.id}`;
        radio.checked = question.correctIndex === index;
        radio.onchange = () => {
          question.correctIndex = index;
        };
        const input = document.createElement('input');
        input.value = option;
        input.oninput = () => {
          question.options[index] = input.value;
        };
        const remove = document.createElement('button');
        remove.textContent = '×';
        remove.onclick = () => {
          question.options.splice(index, 1);
          if (question.correctIndex >= question.options.length) {
            question.correctIndex = Math.max(0, question.options.length - 1);
          }
          renderOptions();
        };
        row.append(radio, input, remove);
        optionsRoot.appendChild(row);
      });
    };
    renderOptions();

    const addOptionBtn = document.createElement('button');
    addOptionBtn.textContent = 'Add option';
    addOptionBtn.onclick = () => {
      question.options.push('');
      renderOptions();
    };

    const pointsInput = document.createElement('input');
    pointsInput.type = 'number';
    pointsInput.value = String(question.points);
    pointsInput.oninput = () => {
      question.points = Number(pointsInput.value) || 0;
    };

    const timeInput = document.createElement('input');
    timeInput.type = 'number';
    timeInput.value = String(question.timeLimitSec);
    timeInput.oninput = () => {
      question.timeLimitSec = Number(timeInput.value) || 1;
    };

    const removeBtn = document.createElement('button');
    removeBtn.className = 'danger';
    removeBtn.textContent = 'Remove question';
    removeBtn.onclick = () => {
      quiz.questions = quiz.questions.filter((item) => item !== question);
      this.renderQuizzesPanel();
    };

    wrap.append(
      this.fieldBlock('Question id', idInput),
      this.fieldBlock('Prompt', textInput),
      label('Options (select correct)'),
      optionsRoot,
      addOptionBtn,
      this.fieldBlock('Points', pointsInput),
      this.fieldBlock('Time limit (sec)', timeInput),
      removeBtn,
    );
    return wrap;
  }

  private renderCheckpointsPanel(): void {
    const startSelect = this.root.querySelector<HTMLSelectElement>('#checkpoint-start');
    if (startSelect) {
      startSelect.replaceChildren();
      for (const cp of this.checkpoints.checkpoints) {
        const option = document.createElement('option');
        option.value = cp.id;
        option.textContent = cp.id;
        if (cp.id === this.checkpoints.start) {
          option.selected = true;
        }
        startSelect.appendChild(option);
      }
      startSelect.onchange = () => {
        this.checkpoints.start = startSelect.value;
      };
    }

    this.checkpointTableBody.replaceChildren();
    for (const cp of this.checkpoints.checkpoints) {
      this.checkpointTableBody.appendChild(this.renderCheckpointRow(cp));
    }

    this.drawMapPreview();
  }

  private renderCheckpointRow(cp: CheckpointDef): HTMLTableRowElement {
    const row = document.createElement('tr');

    const bindNumber = (value: number, apply: (next: number) => void) => {
      const input = document.createElement('input');
      input.type = 'number';
      input.value = String(value);
      input.oninput = () => {
        apply(Number(input.value) || 0);
        this.drawMapPreview();
      };
      return input;
    };

    const idInput = document.createElement('input');
    idInput.value = cp.id;
    idInput.oninput = () => {
      cp.id = idInput.value.trim();
      this.renderCheckpointsPanel();
    };

    const quizInput = document.createElement('input');
    quizInput.value = cp.quizId;
    quizInput.oninput = () => {
      cp.quizId = quizInput.value.trim();
    };

    const nextInput = document.createElement('input');
    nextInput.value = cp.next.join(', ');
    nextInput.oninput = () => {
      cp.next = nextInput.value
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);
    };

    const bossInput = document.createElement('input');
    bossInput.type = 'checkbox';
    bossInput.checked = cp.isBoss;
    bossInput.onchange = () => {
      cp.isBoss = bossInput.checked;
    };

    const hintInput = document.createElement('textarea');
    hintInput.rows = 2;
    hintInput.value = cp.hint;
    hintInput.oninput = () => {
      cp.hint = hintInput.value;
    };

    const removeBtn = document.createElement('button');
    removeBtn.className = 'danger';
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => {
      this.checkpoints.checkpoints = this.checkpoints.checkpoints.filter((item) => item !== cp);
      this.renderCheckpointsPanel();
    };

    row.append(
      cell(idInput),
      cell(bindNumber(cp.x, (v) => (cp.x = v))),
      cell(bindNumber(cp.y, (v) => (cp.y = v))),
      cell(bindNumber(cp.w, (v) => (cp.w = v))),
      cell(bindNumber(cp.h, (v) => (cp.h = v))),
      cell(quizInput),
      cell(nextInput),
      cell(bossInput),
      cell(hintInput),
      cell(removeBtn),
    );
    return row;
  }

  private buildCheckpointSection(): HTMLElement {
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Id</th><th>X</th><th>Y</th><th>W</th><th>H</th>
          <th>Quiz</th><th>Next (csv)</th><th>Boss</th><th>Hint</th><th></th>
        </tr>
      </thead>
    `;
    table.appendChild(this.checkpointTableBody);

    const treasureTitle = document.createElement('h3');
    treasureTitle.textContent = 'Treasure zone';
    const treasureGrid = document.createElement('div');
    treasureGrid.className = 'grid-3';
    treasureGrid.append(
      this.fieldBlock('X', this.treasureInput('x')),
      this.fieldBlock('Y', this.treasureInput('y')),
      this.fieldBlock('W', this.treasureInput('w')),
      this.fieldBlock('H', this.treasureInput('h')),
    );

    const wrapper = document.createElement('div');
    wrapper.append(table, treasureTitle, treasureGrid);
    return wrapper;
  }

  private treasureInput(key: keyof CheckpointOverlay['treasure']): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'number';
    input.value = String(this.checkpoints.treasure[key]);
    input.oninput = () => {
      this.checkpoints.treasure[key] = Number(input.value) || 0;
      this.drawMapPreview();
    };
    return input;
  }

  private makeStartSelect(): HTMLSelectElement {
    const select = document.createElement('select');
    select.id = 'checkpoint-start';
    return select;
  }

  private drawMapPreview(): void {
    const ctx = this.mapCanvas.getContext('2d');
    if (!ctx) {
      return;
    }
    const scale = Math.min(
      this.mapCanvas.width / this.checkpoints.width,
      this.mapCanvas.height / this.checkpoints.height,
    );
    ctx.clearRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);
    ctx.fillStyle = '#15151c';
    ctx.fillRect(0, 0, this.checkpoints.width * scale, this.checkpoints.height * scale);

    for (let y = 0; y < this.checkpoints.height; y++) {
      for (let x = 0; x < this.checkpoints.width; x++) {
        ctx.strokeStyle = '#1f1f28';
        ctx.strokeRect(x * scale, y * scale, scale, scale);
      }
    }

    for (const cp of this.checkpoints.checkpoints) {
      ctx.fillStyle = cp.isBoss ? '#ff6b6b88' : cp.id === this.checkpoints.start ? '#4ecdc488' : '#ffd16666';
      ctx.fillRect(cp.x * scale, cp.y * scale, cp.w * scale, cp.h * scale);
      ctx.fillStyle = '#fff';
      ctx.font = `${Math.max(10, scale * 0.7)}px monospace`;
      ctx.fillText(cp.id, cp.x * scale + 2, cp.y * scale + scale);
    }

    const t = this.checkpoints.treasure;
    ctx.fillStyle = '#c77dff88';
    ctx.fillRect(t.x * scale, t.y * scale, t.w * scale, t.h * scale);
    ctx.fillStyle = '#fff';
    ctx.fillText('treasure', t.x * scale + 2, t.y * scale + scale);
  }

  private panelActions(resource: TabId): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'panel-actions';
    const saveBtn = document.createElement('button');
    saveBtn.className = 'primary';
    saveBtn.textContent = `Save ${resource}`;
    saveBtn.onclick = () => {
      if (resource === 'config') {
        this.saveConfigFromForm();
      } else if (resource === 'quizzes') {
        void this.saveQuizzes();
      } else {
        void this.saveCheckpoints();
      }
    };
    wrap.appendChild(saveBtn);
    return wrap;
  }

  private async saveConfig(next: ExpeditionConfigJson): Promise<void> {
    const errors = validateConfig(next);
    if (errors.length) {
      this.setStatus(errors.join(' '), true);
      return;
    }
    await this.persist('config', next);
    this.config = next;
    this.renderConfigPanel();
  }

  private async saveQuizzes(): Promise<void> {
    const errors = validateQuizzes(this.quizzes);
    if (errors.length) {
      this.setStatus(errors.join(' '), true);
      return;
    }
    await this.persist('quizzes', this.quizzes);
  }

  private async saveCheckpoints(): Promise<void> {
    const quizIds = new Set(this.quizzes.quizzes.map((quiz) => quiz.id));
    const errors = validateCheckpoints(this.checkpoints, quizIds);
    if (errors.length) {
      this.setStatus(errors.join(' '), true);
      return;
    }
    await this.persist('checkpoints', this.checkpoints);
  }

  private async persist(
    resource: 'config' | 'quizzes' | 'checkpoints',
    body: unknown,
  ): Promise<void> {
    this.setStatus(`Saving ${resource}…`);
    try {
      await adminPut(resource, this.token(), body);
      this.setStatus(`Saved ${resource}.`, false);
    } catch (error) {
      this.setStatus(formatError(error), true);
    }
  }

  private setStatus(message: string, isError = false): void {
    this.statusEl.textContent = message;
    this.statusEl.className = isError ? 'status error' : 'status ok';
  }

  private fieldBlock(caption: string, control: HTMLElement): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'field';
    wrap.append(label(caption), control);
    return wrap;
  }
}

function label(text: string): HTMLLabelElement {
  const el = document.createElement('label');
  el.textContent = text;
  return el;
}

function cell(content: HTMLElement): HTMLTableCellElement {
  const td = document.createElement('td');
  td.appendChild(content);
  return td;
}

function formatError(error: unknown): string {
  if (error instanceof AdminApiError) {
    return `Server ${error.status}: ${error.message.trim()}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unexpected error';
}

function defaultQuiz(index: number): QuizSet {
  return {
    id: `q${index}`,
    passThreshold: 20,
    questions: [defaultQuestion(1)],
  };
}

function defaultQuestion(index: number): QuizQuestion {
  return {
    id: `q${index}a`,
    text: 'New question',
    options: ['Option A', 'Option B'],
    correctIndex: 0,
    points: 10,
    timeLimitSec: 20,
  };
}

function defaultCheckpoint(index: number): CheckpointDef {
  return {
    id: `cp${index}`,
    x: 1,
    y: 1,
    w: 2,
    h: 2,
    quizId: 'q1',
    next: [],
    isBoss: false,
    risk: 'NORMAL',
    hint: 'Hint text',
    reward: { points: 50, item: null },
  };
}
