// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_KEY, defaultState, loadState, saveState } from './storage';

describe('storage', () => {
  let store: Record<string, string> = {};
  
  beforeEach(() => {
    store = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        clear: () => { store = {}; }
      },
      writable: true
    });
  });

  it('không có dữ liệu → default state', () => {
    expect(loadState()).toEqual(defaultState());
  });

  it('save rồi load ra đúng dữ liệu', () => {
    const s = defaultState();
    s.stats.completedTotal = 3;
    s.skins.selected = 'sakura';
    saveState(s);
    expect(loadState().stats.completedTotal).toBe(3);
  });

  it('JSON hỏng → default, không throw', () => {
    window.localStorage.setItem(STORAGE_KEY, '{oops');
    expect(loadState()).toEqual(defaultState());
  });

  it('version lạ → default', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 99 }));
    expect(loadState()).toEqual(defaultState());
  });

  it('default: skin sakura đã mở và được chọn, 3 hint', () => {
    const s = defaultState();
    expect(s.skins.unlocked).toEqual(['sakura']);
    expect(s.skins.selected).toBe('sakura');
    expect(s.currentGame).toBeNull();
  });
});
