import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameCard } from './GameCard';
import type { CatalogEntry } from '../catalog/types';

const NullArt = () => null;

const entry: CatalogEntry = {
  id: 'tankarena',
  title: 'Tank Arena',
  description: 'Bắn tăng LAN.',
  category: 'game',
  path: '/games/tankarena/',
  accent: '#7ee29b',
  pluginId: 'tankarena',
  Art: NullArt,
};

describe('GameCard', () => {
  it('là link tới path của game', () => {
    render(<GameCard entry={entry} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/games/tankarena/');
    expect(screen.getByText('Tank Arena')).toBeInTheDocument();
  });

  it('hiển thị live badge khi có stats', () => {
    render(<GameCard entry={entry} stats={{ rooms: 2, players: 5 }} />);
    expect(screen.getByText('● 2 phòng · 5 người')).toBeInTheDocument();
  });

  it('comingSoon: không phải link, có nhãn Sắp ra mắt', () => {
    render(<GameCard entry={{ ...entry, id: 'soon', comingSoon: true }} />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('Sắp ra mắt')).toBeInTheDocument();
  });

  it('hiển thị nhãn nhóm cho mini app', () => {
    render(<GameCard entry={{ ...entry, id: 'sb', category: 'utility', comingSoon: true }} />);
    expect(screen.getByText('Tiện ích')).toBeInTheDocument();
  });
});
