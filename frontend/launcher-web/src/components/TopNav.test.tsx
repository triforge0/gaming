import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopNav } from './TopNav';

describe('TopNav', () => {
  it('hiển thị số người chơi khi online', () => {
    render(<TopNav status={{ online: true, totalPlayers: 5, byPlugin: {} }} />);
    expect(screen.getByText('▲ TRIFORGE')).toBeInTheDocument();
    expect(screen.getByText('● 5 người đang chơi')).toBeInTheDocument();
    expect(screen.getByText('● 5 người đang chơi')).toHaveClass('status-pill', 'is-online');
  });

  it('hiển thị offline khi host không trả lời', () => {
    render(<TopNav status={{ online: false, totalPlayers: 0, byPlugin: {} }} />);
    expect(screen.getByText('▲ TRIFORGE')).toBeInTheDocument();
    expect(screen.getByText('○ offline')).toBeInTheDocument();
    expect(screen.getByText('○ offline')).toHaveClass('status-pill');
    expect(screen.getByText('○ offline')).not.toHaveClass('is-online');
  });
});
