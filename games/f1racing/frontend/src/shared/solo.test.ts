import { describe, expect, it } from 'vitest';
import { buildSoloRoomId, isSoloRoomId, soloModeLabel } from './solo';

describe('solo rooms', () => {
  it('builds sp room ids with mode and track', () => {
    const roomId = buildSoloRoomId('practice', 'city-loop');
    expect(roomId.startsWith('f1racing:sp:practice:city-loop:')).toBe(true);
  });

  it('detects solo room ids', () => {
    expect(isSoloRoomId('f1racing:sp:trial:city-loop:ABC')).toBe(true);
    expect(isSoloRoomId('f1racing:city-loop:ABC')).toBe(false);
  });

  it('maps solo mode labels', () => {
    expect(soloModeLabel('f1racing:sp:bots:city-loop:ABC')).toBe('Race vs Bots');
  });
});
