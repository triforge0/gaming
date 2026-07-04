import { describe, expect, it } from 'vitest';
import { formatJoinCode, formatRoomLevelLabel, resolveBugMinerRoomId } from './roomIds';

describe('roomIds', () => {
  it('resolves short join code', () => {
    expect(resolveBugMinerRoomId('crazy-code-40')).toBe('bugminer:easy-mine:CRAZY-CODE-40');
  });

  it('keeps full bugminer room id', () => {
    expect(resolveBugMinerRoomId('bugminer:rock-mine:LAZY-DEV-7'))
      .toBe('bugminer:rock-mine:LAZY-DEV-7');
  });

  it('fixes level-prefixed join input from URL', () => {
    expect(resolveBugMinerRoomId('easy-mine:CRAZY-CODE-40'))
      .toBe('bugminer:easy-mine:CRAZY-CODE-40');
  });

  it('does not double-prefix level when joining', () => {
    expect(resolveBugMinerRoomId('easy-mine:CRAZY-CODE-40'))
      .not.toBe('bugminer:easy-mine:easy-mine:CRAZY-CODE-40');
  });

  it('formats join code from full room id', () => {
    expect(formatJoinCode('bugminer:easy-mine:CRAZY-CODE-40')).toBe('CRAZY-CODE-40');
  });

  it('normalizes full room id casing', () => {
    expect(resolveBugMinerRoomId('BUGMINER:EASY-MINE:crazy-code-40'))
      .toBe('bugminer:easy-mine:CRAZY-CODE-40');
  });

  it('formats level label', () => {
    expect(formatRoomLevelLabel('bugminer:easy-mine:CRAZY-CODE-40')).toBe('Easy Mine');
  });
});
