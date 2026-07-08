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

  it('đăng ký game behocvui với cấu hình chính xác', () => {
    const behocvui = REGISTRY.find((e) => e.id === 'behocvui');
    expect(behocvui).toBeDefined();
    expect(behocvui?.title).toBe('Bé Học Vui');
    expect(behocvui?.category).toBe('education');
    expect(behocvui?.isHtmlEmbed).toBe(true);
    expect(behocvui?.externalUrl).toBe('https://education-game-sigma.vercel.app');
    expect(behocvui?.path).toBe('/?play=behocvui');
    expect(behocvui?.accent).toBe('#ec4899');
    expect(behocvui?.authorTag).toBe('Made by Phú');
    expect(behocvui?.badge).toBe('NEW');
    expect(behocvui?.Art).toBeDefined();
  });
});
