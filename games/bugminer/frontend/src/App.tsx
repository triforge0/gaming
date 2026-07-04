import { useSocket } from './hooks/useSocket';
import { useGameStore } from './store/gameStore';
import HomeScreen from './screens/HomeScreen';
import LobbyScreen from './screens/LobbyScreen';
import SetupScreen from './screens/SetupScreen';
import GameScreen from './screens/GameScreen';
import BattleGameScreen from './screens/BattleGameScreen';
import ResultScreen from './screens/ResultScreen';

export default function App() {
  const socket = useSocket();
  const screen = useGameStore((s) => s.screen);
  const error = useGameStore((s) => s.error);
  const connected = useGameStore((s) => s.connected);
  const gameState = useGameStore((s) => s.gameState);

  return (
    <div className="app-shell">
      {!connected && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: '#e74c3c', textAlign: 'center', padding: '6px', fontSize: '0.85rem',
        }}>
          Connecting to server...
        </div>
      )}
      {error && (
        <div style={{
          position: 'fixed', top: connected ? 0 : 32, left: '50%', transform: 'translateX(-50%)',
          zIndex: 100, background: '#e74c3c', padding: '10px 24px', borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          {error}
        </div>
      )}
      {screen === 'home' && <HomeScreen socket={socket} />}
      {screen === 'lobby' && <LobbyScreen socket={socket} />}
      {screen === 'setup' && (gameState ? <SetupScreen socket={socket} /> : <HomeScreen socket={socket} />)}
      {screen === 'game' && gameState && (
        gameState.fairMode?.battle
          ? <BattleGameScreen socket={socket} />
          : <GameScreen socket={socket} />
      )}
      {screen === 'game' && !gameState && <HomeScreen socket={socket} />}
      {screen === 'result' && (gameState ? <ResultScreen socket={socket} /> : <HomeScreen socket={socket} />)}
    </div>
  );
}
