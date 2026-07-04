// src/ui/Drawer.tsx
import { useState } from 'react';
import { ACHIEVEMENTS, type SkinId } from '../core/achievements';
import { SKINS } from '../skins';
import { useGame } from '../state/store';

type Tab = 'skins' | 'badges' | 'settings';

export function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('skins');
  const persisted = useGame((s) => s.persisted);
  const setSkin = useGame((s) => s.setSkin);
  const toggleSound = useGame((s) => s.toggleSound);
  if (!open) return null;

  return (
    <aside className="drawer">
      <header className="drawer-head">
        <nav>
          <button className={tab === 'skins' ? 'active' : ''} onClick={() => setTab('skins')}>🎨 Skin</button>
          <button className={tab === 'badges' ? 'active' : ''} onClick={() => setTab('badges')}>🏆 Badge</button>
          <button className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')}>⚙️</button>
        </nav>
        <button onClick={onClose}>✕</button>
      </header>

      {tab === 'skins' && (
        <ul className="drawer-list">
          {(Object.keys(SKINS) as SkinId[]).map((id) => {
            const unlocked = persisted.skins.unlocked.includes(id);
            const selected = persisted.skins.selected === id;
            return (
              <li key={id}>
                <button
                  className={`skin-row ${selected ? 'active' : ''}`}
                  disabled={!unlocked}
                  onClick={() => setSkin(id)}
                >
                  {SKINS[id].icon} {SKINS[id].name}
                  <small>{unlocked ? (selected ? 'Đang dùng' : '') : `🔒 ${SKINS[id].unlockLabel}`}</small>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {tab === 'badges' && (
        <ul className="drawer-list">
          {ACHIEVEMENTS.map((a) => {
            const earnedAt = persisted.achievements[a.id];
            return (
              <li key={a.id} className={`badge-row ${earnedAt ? 'earned' : ''}`}>
                {a.icon} {a.title}
                <small>{earnedAt ? new Date(earnedAt).toLocaleDateString('vi-VN') : 'Chưa đạt'}</small>
              </li>
            );
          })}
        </ul>
      )}

      {tab === 'settings' && (
        <div className="drawer-list">
          <label className="setting-row">
            <input type="checkbox" checked={persisted.settings.sound} onChange={toggleSound} />
            Âm thanh
          </label>
          <p className="setting-note">
            Đã hoàn thành: {persisted.stats.completedTotal} cube
          </p>
        </div>
      )}
    </aside>
  );
}
