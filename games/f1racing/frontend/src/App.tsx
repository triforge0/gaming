import { useSocket } from './hooks/useSocket';
import { useF1Store } from './store/f1Store';
import MainMenuScreen from './screens/MainMenuScreen';
import JoinRoomScreen from './screens/JoinRoomScreen';
import SinglePlayerScreen from './screens/SinglePlayerScreen';
import LobbyScreen from './screens/LobbyScreen';
import RaceScreen from './screens/RaceScreen';
import ResultsScreen from './screens/ResultsScreen';
import ReplayScreen from './screens/ReplayScreen';
import GarageScreen from './screens/GarageScreen';
import SettingsScreen from './screens/SettingsScreen';

export default function App() {
  const socket = useSocket();
  const screen = useF1Store((state) => state.screen);
  const error = useF1Store((state) => state.error);
  const connected = useF1Store((state) => state.connected);

  return (
    <div className="app-shell">
      {!connected && (
        <div className="banner warn">Đang kết nối lobby API...</div>
      )}
      {error && (
        <div className="banner error" onClick={() => useF1Store.getState().setError(null)}>
          {error}
        </div>
      )}

      {screen === 'menu' && <MainMenuScreen socket={socket} />}
      {screen === 'join' && <JoinRoomScreen socket={socket} />}
      {screen === 'singleplayer' && <SinglePlayerScreen socket={socket} />}
      {screen === 'lobby' && <LobbyScreen socket={socket} />}
      {screen === 'race' && (
        <RaceScreen
          bridge={socket.getBridge()}
          onLeave={socket.leave}
          onSkipQualifying={socket.skipQualifying}
        />
      )}
      {screen === 'results' && (
        <ResultsScreen
          onBackToMenu={socket.leave}
          onBackToLobby={() => useF1Store.getState().setScreen('lobby')}
        />
      )}
      {screen === 'garage' && <GarageScreen />}
      {screen === 'replay' && <ReplayScreen />}
      {screen === 'settings' && <SettingsScreen />}
    </div>
  );
}
