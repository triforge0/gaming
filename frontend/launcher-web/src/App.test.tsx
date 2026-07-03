import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('hiển thị logo TRIFORGE', () => {
    render(<App />);
    expect(screen.getByText(/TRIFORGE/)).toBeInTheDocument();
  });
});
