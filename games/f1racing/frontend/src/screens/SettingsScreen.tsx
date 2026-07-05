import { useEffect, useState } from 'react';
import { DEFAULT_KEY_BINDINGS } from '../settings/defaults';
import { formatKeyCode, readSettings, writeSettings } from '../settings/storage';
import type { GameSettings, KeyBindings } from '../settings/types';
import { useF1Store } from '../store/f1Store';

type BindingField = keyof KeyBindings;

const BINDING_LABELS: Record<BindingField, string> = {
  throttle: 'Throttle',
  brake: 'Brake',
  steerLeft: 'Steer left',
  steerRight: 'Steer right',
  handbrake: 'Handbrake',
  nitro: 'Nitro',
  toggleCamera: 'Toggle camera',
};

export default function SettingsScreen() {
  const [settings, setSettings] = useState<GameSettings>(() => readSettings());
  const [capturing, setCapturing] = useState<BindingField | null>(null);

  useEffect(() => {
    if (!capturing) return;
    const onKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      const code = event.code;
      setSettings((current) => {
        const nextBindings = { ...current.keyBindings };
        if (capturing === 'throttle' || capturing === 'brake' || capturing === 'nitro') {
          nextBindings[capturing] = [code];
        } else {
          nextBindings[capturing] = code;
        }
        return { ...current, keyBindings: nextBindings };
      });
      setCapturing(null);
    };
    window.addEventListener('keydown', onKeyDown, { once: true });
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [capturing]);

  const save = () => {
    writeSettings(settings);
    useF1Store.getState().setScreen('menu');
  };

  const resetBindings = () => {
    setSettings((current) => ({
      ...current,
      keyBindings: { ...DEFAULT_KEY_BINDINGS },
    }));
  };

  return (
    <div className="screen settings-screen">
      <div className="panel wide">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Settings</p>
            <h2>Client preferences</h2>
          </div>
          <button type="button" className="btn small" onClick={() => useF1Store.getState().setScreen('menu')}>
            ← Menu
          </button>
        </div>

        <section className="settings-section">
          <h3>Graphics</h3>
          <label className="field-label" htmlFor="graphics-quality">Quality preset</label>
          <select
            id="graphics-quality"
            className="input"
            value={settings.graphicsQuality}
            onChange={(event) => setSettings((current) => ({
              ...current,
              graphicsQuality: event.target.value as GameSettings['graphicsQuality'],
            }))}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <p className="hint">Áp dụng khi vào màn đua (shadows, pixel ratio, fog).</p>
        </section>

        <section className="settings-section">
          <h3>Audio</h3>
          <label>
            Master volume
            <input
              className="input"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.masterVolume}
              onChange={(event) => setSettings((current) => ({
                ...current,
                masterVolume: Number(event.target.value),
              }))}
            />
          </label>
          <label>
            SFX volume
            <input
              className="input"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.sfxVolume}
              onChange={(event) => setSettings((current) => ({
                ...current,
                sfxVolume: Number(event.target.value),
              }))}
            />
          </label>
          <label>
            Music volume
            <input
              className="input"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.musicVolume}
              onChange={(event) => setSettings((current) => ({
                ...current,
                musicVolume: Number(event.target.value),
              }))}
            />
          </label>
        </section>

        <section className="settings-section">
          <div className="settings-section-header">
            <h3>Controls</h3>
            <button type="button" className="btn small" onClick={resetBindings}>Reset defaults</button>
          </div>
          <div className="binding-grid">
            {(Object.keys(BINDING_LABELS) as BindingField[]).map((field) => (
              <button
                key={field}
                type="button"
                className={`binding-row${capturing === field ? ' capturing' : ''}`}
                onClick={() => setCapturing(field)}
              >
                <span>{BINDING_LABELS[field]}</span>
                <code>{formatBindingValue(settings.keyBindings, field)}</code>
              </button>
            ))}
          </div>
          <p className="hint">
            {capturing
              ? `Nhấn phím mới cho ${BINDING_LABELS[capturing]}...`
              : 'Click một hàng để rebind. Arrow keys vẫn hoạt động mặc định cho steer/throttle/brake.'}
          </p>
        </section>

        <div className="lobby-actions">
          <button type="button" className="btn primary" onClick={save}>Lưu cài đặt</button>
        </div>
      </div>
    </div>
  );
}

function formatBindingValue(bindings: KeyBindings, field: BindingField): string {
  const value = bindings[field];
  if (Array.isArray(value)) {
    return value.length > 0 ? value.map(formatKeyCode).join(' / ') : '—';
  }
  return value ? formatKeyCode(value) : '—';
}
