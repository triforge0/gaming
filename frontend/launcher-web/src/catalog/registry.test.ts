import { describe, it, expect } from 'vitest';
import { REGISTRY } from './registry';

describe('REGISTRY', () => {
  it('id không trùng nhau', () => {
    const ids = REGISTRY.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('mọi path bắt đầu bằng /', () => {
    for (const e of REGISTRY) {
      expect(e.path.startsWith('/')).toBe(true);
    }
  });

  it('mọi game server-side không phải comingSoon đều có pluginId', () => {
    const games = REGISTRY.filter(
      (e) => e.category === 'game' && !e.comingSoon && !e.isHtmlEmbed,
    );
    expect(games.length).toBeGreaterThan(0);
    for (const g of games) {
      expect(g.pluginId).toBeTruthy();
    }
  });

  it('có ít nhất một mini app placeholder cho mỗi nhóm', () => {
    for (const cat of ['utility', 'education', 'arcade'] as const) {
      expect(REGISTRY.some((e) => e.category === cat)).toBe(true);
    }
  });
});
