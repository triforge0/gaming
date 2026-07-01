import Phaser from 'phaser';
import { Team } from '@triforge/shared-ui';
import { TEAM_COLOR, TEAM_CSS, teamLabel } from '../ui/matchUi';

export interface HeadquartersLayout {
  team: number;
  centerX: number;
  centerY: number;
  tileSize: number;
  maxHp: number;
}

interface HeadquartersVisual {
  container: Phaser.GameObjects.Container;
  glow: Phaser.GameObjects.Arc;
  hpPips: Phaser.GameObjects.Rectangle[];
  maxHp: number;
}

const HQ_DEPTH = 4;

const TEAM_GLOW: Record<number, number> = {
  [Team.TEAM_RED]: 0xff6b6b,
  [Team.TEAM_BLUE]: 0x60a5fa,
};

const TEAM_DARK: Record<number, number> = {
  [Team.TEAM_RED]: 0x8b1e22,
  [Team.TEAM_BLUE]: 0x1e3a8a,
};

function drawEagleEmblem(graphics: Phaser.GameObjects.Graphics, color: number): void {
  graphics.fillStyle(color, 1);
  graphics.fillTriangle(0, -10, -12, 8, 12, 8);
  graphics.fillStyle(0xffd166, 1);
  graphics.fillCircle(0, -2, 4);
  graphics.fillStyle(color, 1);
  graphics.fillTriangle(-14, 2, -6, 0, -10, 10);
  graphics.fillTriangle(14, 2, 6, 0, 10, 10);
}

function createHeadquartersVisual(
  scene: Phaser.Scene,
  layout: HeadquartersLayout,
): HeadquartersVisual {
  const team = layout.team;
  const accent = TEAM_COLOR[team] ?? 0xffd166;
  const glowColor = TEAM_GLOW[team] ?? accent;
  const dark = TEAM_DARK[team] ?? 0x333333;
  const size = layout.tileSize;

  const container = scene.add.container(layout.centerX, layout.centerY).setDepth(HQ_DEPTH);

  const glow = scene.add.circle(0, 0, size * 0.72, glowColor, 0.22);
  scene.tweens.add({
    targets: glow,
    alpha: { from: 0.14, to: 0.32 },
    scale: { from: 0.92, to: 1.08 },
    duration: 1400,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
  });

  const platform = scene.add.rectangle(0, size * 0.08, size * 0.92, size * 0.88, 0x1a1a22, 1);
  platform.setStrokeStyle(2, 0x444455, 0.9);

  const bunker = scene.add.rectangle(0, -size * 0.04, size * 0.72, size * 0.62, dark, 1);
  bunker.setStrokeStyle(3, accent, 1);

  const roof = scene.add.triangle(0, -size * 0.38, -size * 0.38, -size * 0.08, size * 0.38, -size * 0.08, 0, -size * 0.52, accent, 1);
  roof.setStrokeStyle(2, 0xffe08a, 0.85);

  const emblem = scene.add.graphics({ x: 0, y: size * 0.02 });
  drawEagleEmblem(emblem, 0xffd166);

  const flagPole = scene.add.rectangle(size * 0.22, -size * 0.18, 2, size * 0.28, 0xcccccc, 1);
  const flag = scene.add.triangle(
    size * 0.28,
    -size * 0.28,
    size * 0.28,
    -size * 0.14,
    size * 0.42,
    -size * 0.21,
    accent,
    1,
  );

  const hpPips: Phaser.GameObjects.Rectangle[] = [];
  const pipCount = layout.maxHp;
  const pipWidth = Math.min(8, (size * 0.7) / pipCount - 2);
  const pipGap = 2;
  const totalWidth = pipCount * pipWidth + (pipCount - 1) * pipGap;
  const startX = -totalWidth / 2 + pipWidth / 2;

  for (let i = 0; i < pipCount; i++) {
    const pip = scene.add
      .rectangle(startX + i * (pipWidth + pipGap), -size * 0.52, pipWidth, 6, accent, 1)
      .setStrokeStyle(1, 0xffffff, 0.35);
    hpPips.push(pip);
  }

  const label = scene.add
    .text(0, size * 0.38, team === Team.TEAM_RED ? 'RED HQ' : team === Team.TEAM_BLUE ? 'BLUE HQ' : 'HQ', {
      fontSize: '11px',
      color: '#ffe08a',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    })
    .setOrigin(0.5);

  container.add([glow, platform, bunker, roof, emblem, flagPole, flag, ...hpPips, label]);

  return { container, glow, hpPips, maxHp: layout.maxHp };
}

export class HeadquartersOverlay {
  private readonly scene: Phaser.Scene;
  private readonly visuals = new Map<number, HeadquartersVisual>();
  private hudPanel?: HqHudPanel;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  build(layouts: HeadquartersLayout[]): void {
    this.destroyAll();
    for (const layout of layouts) {
      this.visuals.set(layout.team, createHeadquartersVisual(this.scene, layout));
    }
    if (layouts.length > 0 && !this.hudPanel) {
      this.hudPanel = new HqHudPanel(this.scene);
    }
    for (const layout of layouts) {
      this.setHp(layout.team, layout.maxHp, layout.maxHp);
    }
  }

  setHp(team: number, hp: number, maxHp: number): void {
    const visual = this.visuals.get(team);
    if (visual) {
      const accent = TEAM_COLOR[team] ?? 0xffd166;
      const critical = hp <= 2 && hp > 0;
      for (let i = 0; i < visual.hpPips.length; i++) {
        const active = i < hp;
        visual.hpPips[i].setFillStyle(active ? accent : 0x2a2a30, active ? 1 : 0.6);
        visual.hpPips[i].setVisible(i < maxHp);
      }
      if (critical) {
        visual.glow.setFillStyle(0xff4444, 0.35);
      } else {
        visual.glow.setFillStyle(TEAM_GLOW[team] ?? accent, 0.22);
      }
    }
    this.hudPanel?.setHp(team, hp, maxHp);
  }

  flashDamage(team: number): void {
    const visual = this.visuals.get(team);
    if (!visual) {
      return;
    }
    this.scene.tweens.add({
      targets: visual.container,
      angle: { from: -4, to: 4 },
      duration: 50,
      yoyo: true,
      repeat: 3,
      onComplete: () => visual.container.setAngle(0),
    });
    this.scene.tweens.add({
      targets: visual.glow,
      alpha: 0.7,
      scale: 1.25,
      duration: 80,
      yoyo: true,
    });
    this.hudPanel?.flashDamage(team);
  }

  destroyTeam(team: number): void {
    const visual = this.visuals.get(team);
    visual?.container.destroy();
    this.visuals.delete(team);
    this.hudPanel?.destroyTeam(team);
  }

  destroyAll(): void {
    for (const visual of this.visuals.values()) {
      visual.container.destroy();
    }
    this.visuals.clear();
    this.hudPanel?.destroy();
    this.hudPanel = undefined;
  }
}

class HqHudPanel {
  private readonly scene: Phaser.Scene;
  private readonly container: Phaser.GameObjects.Container;
  private readonly cards = new Map<number, HqHudCard>();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0).setDepth(10);
    this.createCard(Team.TEAM_RED, 110, 572);
    this.createCard(Team.TEAM_BLUE, 690, 572);
  }

  private createCard(team: number, x: number, y: number): void {
    const accent = TEAM_COLOR[team] ?? 0xffffff;
    const css = TEAM_CSS[team] ?? '#ffffff';
    const card = this.scene.add.container(x, y);

    const bg = this.scene.add
      .rectangle(0, 0, 148, 40, 0x12121a, 0.96)
      .setStrokeStyle(2, accent, 0.95);
    const icon = this.scene.add
      .text(-58, 0, '⛊', { fontSize: '20px', color: css })
      .setOrigin(0.5);
    const title = this.scene.add
      .text(-38, 0, `${teamLabel(team).toUpperCase()} HQ`, {
        fontSize: '13px',
        color: css,
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5);

    const pips: Phaser.GameObjects.Rectangle[] = [];
    for (let i = 0; i < 5; i++) {
      const pip = this.scene.add
        .rectangle(24 + i * 16, 0, 13, 12, accent, 1)
        .setStrokeStyle(1, 0xffffff, 0.25);
      pips.push(pip);
    }

    card.add([bg, icon, title, ...pips]);
    this.container.add(card);
    this.cards.set(team, { card, bg, pips, maxHp: 5 });
  }

  setHp(team: number, hp: number, maxHp: number): void {
    const entry = this.cards.get(team);
    if (!entry) {
      return;
    }
    entry.maxHp = maxHp;
    const accent = TEAM_COLOR[team] ?? 0xffffff;
    const critical = hp <= 2 && hp > 0;
    entry.bg.setStrokeStyle(2, critical ? 0xff4444 : accent, critical ? 1 : 0.95);
    for (let i = 0; i < entry.pips.length; i++) {
      entry.pips[i].setVisible(i < maxHp);
      entry.pips[i].setFillStyle(i < hp ? accent : 0x2a2a30, i < hp ? 1 : 0.5);
    }
  }

  flashDamage(team: number): void {
    const entry = this.cards.get(team);
    if (!entry) {
      return;
    }
    this.scene.tweens.add({
      targets: entry.card,
      scaleX: 1.06,
      scaleY: 1.06,
      duration: 80,
      yoyo: true,
    });
  }

  destroyTeam(team: number): void {
    const entry = this.cards.get(team);
    if (!entry) {
      return;
    }
    for (const pip of entry.pips) {
      pip.setFillStyle(0x111111, 0.3);
    }
    entry.bg.setStrokeStyle(2, 0x444444, 0.5);
    entry.card.setAlpha(0.45);
  }

  destroy(): void {
    this.container.destroy();
    this.cards.clear();
  }
}

interface HqHudCard {
  card: Phaser.GameObjects.Container;
  bg: Phaser.GameObjects.Rectangle;
  pips: Phaser.GameObjects.Rectangle[];
  maxHp: number;
}

/** HQ tiles use a subtle floor so the bunker sprite reads clearly on top. */
export function headquartersFloorColor(): number {
  return 0x252530;
}

export function buildHeadquartersLayouts(
  map: {
    headquarters?: Array<{
      team?: number | null;
      x?: number | null;
      y?: number | null;
      width?: number | null;
      height?: number | null;
      maxHp?: number | null;
    }> | null;
    tileSize?: number | null;
  },
  tileSize: number,
): HeadquartersLayout[] {
  const layouts: HeadquartersLayout[] = [];
  for (const hq of map.headquarters ?? []) {
    const team = hq.team ?? Team.TEAM_NONE;
    if (team !== Team.TEAM_RED && team !== Team.TEAM_BLUE) {
      continue;
    }
    const x = hq.x ?? 0;
    const y = hq.y ?? 0;
    const width = hq.width ?? 1;
    const height = hq.height ?? 1;
    layouts.push({
      team,
      centerX: (x + width / 2) * tileSize,
      centerY: (y + height / 2) * tileSize,
      tileSize: map.tileSize ?? tileSize,
      maxHp: hq.maxHp ?? 5,
    });
  }
  return layouts;
}
