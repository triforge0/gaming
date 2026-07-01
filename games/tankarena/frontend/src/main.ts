import Phaser from 'phaser';
import LobbyScene from './scenes/LobbyScene';
import RoomLobbyScene from './scenes/RoomLobbyScene';
import GameScene from './scenes/GameScene';
import ScoreboardScene from './scenes/ScoreboardScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#0a0a0c',
  scene: [LobbyScene, RoomLobbyScene, GameScene, ScoreboardScene],
};

new Phaser.Game(config);
export {};
