// src/ui/ui.test.tsx
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { WinModal } from './WinModal';
import { Drawer } from './Drawer';
import { Toasts } from './Toasts';
import { startPresenceHeartbeat } from '../presence';

describe('UI Components', () => {
  it('renders WinModal without crashing', () => {
    const html = renderToString(<WinModal />);
    expect(html).toBeTypeOf('string');
  });

  it('renders Drawer without crashing', () => {
    const html = renderToString(<Drawer open={true} onClose={() => {}} />);
    expect(html).toBeTypeOf('string');
  });

  it('renders Toasts without crashing', () => {
    const html = renderToString(<Toasts />);
    expect(html).toBeTypeOf('string');
  });
});

describe('presence client', () => {
  it('initializes without throwing in test environment', () => {
    const stop = startPresenceHeartbeat('test');
    expect(stop).toBeTypeOf('function');
    stop();
  });
});
