import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LiveBadge } from './LiveBadge';

describe('LiveBadge', () => {
  it('không render khi không có stats', () => {
    const { container } = render(<LiveBadge />);
    expect(container).toBeEmptyDOMElement();
  });

  it('không render khi rooms = 0', () => {
    const { container } = render(<LiveBadge stats={{ rooms: 0, players: 0 }} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('hiển thị số phòng và người chơi', () => {
    render(<LiveBadge stats={{ rooms: 2, players: 5 }} />);
    expect(screen.getByText('● 2 phòng · 5 người')).toBeInTheDocument();
    expect(screen.getByText('● 2 phòng · 5 người')).toHaveClass('live-badge');
  });
});
