import { describe, expect, it } from 'vitest';
import { formatJoinCode, formatTrackLabel, resolveF1RoomId } from './roomIds';

describe('roomIds', () => {
  it('resolves short code with default track', () => {
    expect(resolveF1RoomId('fast-dev-42')).toBe('f1racing:city-loop:FAST-DEV-42');
  });

  it('resolves track-prefixed code', () => {
    expect(resolveF1RoomId('city-loop:POLE-LAP-7')).toBe('f1racing:city-loop:POLE-LAP-7');
  });

  it('normalizes full room id', () => {
    expect(resolveF1RoomId('f1racing:city-loop:grid-car-3'))
      .toBe('f1racing:city-loop:GRID-CAR-3');
  });

  it('formats join code with track prefix', () => {
    expect(formatJoinCode('f1racing:city-loop:FAST-DEV-42')).toBe('city-loop:FAST-DEV-42');
  });

  it('formats track label', () => {
    expect(formatTrackLabel('f1racing:city-loop:ABC')).toBe('City Loop');
  });
});
