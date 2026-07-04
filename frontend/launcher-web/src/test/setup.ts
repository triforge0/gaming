import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

vi.mock('mixpanel-browser', () => {
  return {
    default: {
      init: vi.fn(),
      track: vi.fn(),
      identify: vi.fn(),
    },
  };
});

afterEach(() => {
  cleanup();
});
