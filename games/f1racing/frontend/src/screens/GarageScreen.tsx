import { useState } from 'react';
import {
  CAR_PRESETS,
  LIVERY_OPTIONS,
  NITRO_FX_OPTIONS,
  WHEEL_OPTIONS,
  formatCarLabel,
  normalizeGarageLoadout,
} from '../garage/catalog';
import { readGarageLoadout, writeGarageLoadout } from '../garage/storage';
import { DEFAULT_GARAGE_LOADOUT, type GarageLoadout } from '../shared';
import { useF1Store } from '../store/f1Store';

export default function GarageScreen() {
  const initial = readGarageLoadout();
  const [loadout, setLoadout] = useState<GarageLoadout>(initial);

  const selectPreset = (carId: string) => {
    const preset = CAR_PRESETS.find((entry) => entry.id === carId);
    if (!preset) return;
    setLoadout((current) => ({
      ...current,
      carId: preset.id,
      primaryColor: current.primaryColor || preset.defaultColor,
    }));
  };

  const save = () => {
    writeGarageLoadout(loadout);
    useF1Store.getState().setScreen('menu');
  };

  return (
    <div className="screen garage-screen">
      <div className="panel wide">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Garage</p>
            <h2>{formatCarLabel(loadout.carId)}</h2>
          </div>
          <button type="button" className="btn small" onClick={() => useF1Store.getState().setScreen('menu')}>
            ← Menu
          </button>
        </div>

        <p className="hint">Cosmetic only — cùng physics trên mọi preset. Lưu local trên trình duyệt này.</p>

        <section className="garage-section">
          <h3>Chọn xe</h3>
          <div className="car-grid">
            {CAR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`car-card${loadout.carId === preset.id ? ' selected' : ''}`}
                onClick={() => selectPreset(preset.id)}
              >
                <span className="car-card-swatch" style={{ background: preset.defaultColor }} />
                <strong>{preset.name}</strong>
                <span className="muted">{preset.tagline}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="garage-section">
          <h3>Tùy chỉnh</h3>
          <div className="garage-options">
            <label>
              Màu chính
              <input
                className="input color-input"
                type="color"
                value={loadout.primaryColor}
                onChange={(event) => setLoadout((current) => ({
                  ...current,
                  primaryColor: event.target.value,
                }))}
              />
            </label>
            <label>
              Livery
              <select
                className="input"
                value={loadout.liveryId}
                onChange={(event) => setLoadout((current) => ({
                  ...current,
                  liveryId: event.target.value,
                }))}
              >
                {LIVERY_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </label>
            <label>
              Wheels
              <select
                className="input"
                value={loadout.wheelId}
                onChange={(event) => setLoadout((current) => ({
                  ...current,
                  wheelId: event.target.value,
                }))}
              >
                {WHEEL_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </label>
            <label>
              Nitro FX
              <select
                className="input"
                value={loadout.nitroFxId}
                onChange={(event) => setLoadout((current) => ({
                  ...current,
                  nitroFxId: event.target.value,
                }))}
              >
                {NITRO_FX_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <div className="garage-preview large">
          <span className="color-swatch large" style={{ background: loadout.primaryColor }} />
          <div>
            <strong>{formatCarLabel(loadout.carId)}</strong>
            <p className="muted">
              {loadout.liveryId} · {loadout.wheelId} · {loadout.nitroFxId}
            </p>
          </div>
        </div>

        <div className="lobby-actions">
          <button
            type="button"
            className="btn"
            onClick={() => setLoadout(normalizeGarageLoadout(DEFAULT_GARAGE_LOADOUT))}
          >
            Reset mặc định
          </button>
          <button type="button" className="btn primary" onClick={save}>Lưu garage</button>
        </div>
      </div>
    </div>
  );
}
