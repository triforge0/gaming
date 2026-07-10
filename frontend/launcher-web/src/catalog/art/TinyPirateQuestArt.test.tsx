import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TinyPirateQuestArt } from './TinyPirateQuestArt';

describe('TinyPirateQuestArt', () => {
  it('renders the SVG with correct attributes and child elements', () => {
    render(<TinyPirateQuestArt />);
    
    // Check that SVG is rendered and has the correct role & label
    const svgEl = screen.getByRole('img', { name: 'Tiny Pirate Quest' });
    expect(svgEl).toBeInTheDocument();
    expect(svgEl).toHaveAttribute('viewBox', '0 0 400 200');

    // Check that title text is rendered
    expect(screen.getByText('TINY PIRATE QUEST')).toBeInTheDocument();
  });
});
