package com.triforge.games.tankarena.match;

/** Why a lobby command was rejected while the room is in (or expected to be in) lobby flow. */
public enum LobbyRejectReason {
    NONE,
    NOT_IN_LOBBY_PHASE,
    PLAYER_NOT_FOUND,
    INVALID_NAME,
    INVALID_TEAM,
    TEAM_BALANCE,
    NOT_ON_PLAYABLE_TEAM,
    NOT_TEAM_CAPTAIN,
    INVALID_SPAWN_REGION,
    TEAM_SETUP_INCOMPLETE
}
