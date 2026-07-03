import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('./live/api', () => ({ fetchRooms: vi.fn() }));

import { fetchRooms } from './live/api';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    vi.mocked(fetchRooms).mockReset();
  });

  it('online: hiển thị pill số người chơi và live badge trên card', async () => {
    vi.mocked(fetchRooms).mockResolvedValue({
      rooms: [{ gamePluginId: 'tankarena', playerCount: 5 }],
    });
    render(<App />);
    expect(await screen.findByText('● 5 người đang chơi')).toBeInTheDocument();
    expect(screen.getAllByText('● 1 phòng · 5 người').length).toBeGreaterThan(0);
    expect(screen.getByText('▶ CHƠI NGAY')).toBeInTheDocument();
  });

  it('offline: catalog vẫn đầy đủ, pill offline, không có badge', async () => {
    vi.mocked(fetchRooms).mockRejectedValue(new Error('down'));
    render(<App />);
    expect(await screen.findByText('○ offline')).toBeInTheDocument();
    expect(screen.getAllByText('Tank Arena').length).toBeGreaterThan(0);
    expect(screen.getByText('Quiz nhanh')).toBeInTheDocument();
    expect(screen.queryByText(/phòng ·/)).toBeNull();
  });

  it('luôn có hàng GAMES và MINI APPS', async () => {
    vi.mocked(fetchRooms).mockRejectedValue(new Error('down'));
    render(<App />);
    expect(await screen.findByText('GAMES')).toBeInTheDocument();
    expect(screen.getByText('MINI APPS')).toBeInTheDocument();
  });
});
