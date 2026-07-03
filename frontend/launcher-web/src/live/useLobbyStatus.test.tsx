import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('./api', () => ({ fetchRooms: vi.fn() }));

import { fetchRooms } from './api';
import { useLobbyStatus } from './useLobbyStatus';
import { OFFLINE_STATUS } from '../catalog/types';

describe('useLobbyStatus', () => {
  beforeEach(() => {
    vi.mocked(fetchRooms).mockReset();
  });

  it('bắt đầu offline rồi chuyển online khi API trả dữ liệu', async () => {
    vi.mocked(fetchRooms).mockResolvedValue({
      rooms: [{ gamePluginId: 'tankarena', playerCount: 3 }],
    });
    const { result } = renderHook(() => useLobbyStatus(60_000));
    await waitFor(() => expect(result.current.online).toBe(true));
    expect(result.current.totalPlayers).toBe(3);
    expect(result.current.byPlugin['tankarena']).toEqual({ rooms: 1, players: 3 });
  });

  it('giữ trạng thái offline khi API lỗi', async () => {
    vi.mocked(fetchRooms).mockRejectedValue(new Error('down'));
    const { result } = renderHook(() => useLobbyStatus(60_000));
    await waitFor(() => expect(fetchRooms).toHaveBeenCalled());
    expect(result.current).toEqual(OFFLINE_STATUS);
  });
});
