import { IEntity, Team, toNum } from '@triforge/shared-ui';

export interface PlayerInfo {
  name: string;
  team: number;
}

export class PlayerRegistry {
  private readonly players = new Map<number, PlayerInfo>();

  updateFromEntities(entities: IEntity[]): void {
    for (const entity of entities) {
      if (!entity.player) {
        continue;
      }
      const playerId = toNum(entity.player.playerId);
      this.players.set(playerId, {
        name: entity.player.name ?? `Player-${playerId}`,
        team: entity.player.team ?? Team.TEAM_NONE,
      });
    }
  }

  name(playerId: number): string {
    return this.players.get(playerId)?.name ?? `Player-${playerId}`;
  }

  team(playerId: number): number {
    return this.players.get(playerId)?.team ?? Team.TEAM_NONE;
  }

  selfTeam(selfPlayerId: number): number {
    return this.team(selfPlayerId);
  }

  clear(): void {
    this.players.clear();
  }
}
