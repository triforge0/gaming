package com.triforge.games.tankarena.components;

import com.triforge.engine.ecs.Component;
import com.triforge.games.tankarena.match.Team;

public final class PlayerComponent implements Component {
    public static final int DEFAULT_LIVES = 3;

    private final long playerId;
    private final String name;
    private final Team team;
    private int score;
    private int lives;

    public PlayerComponent(long playerId, String name) {
        this(playerId, name, DEFAULT_LIVES);
    }

    public PlayerComponent(long playerId, String name, int lives) {
        this(playerId, name, lives, Team.NONE);
    }

    public PlayerComponent(long playerId, String name, int lives, Team team) {
        this.playerId = playerId;
        this.name = name;
        this.team = team == null ? Team.NONE : team;
        this.score = 0;
        this.lives = lives;
    }

    public Team team() {
        return team;
    }

    public long playerId() {
        return playerId;
    }

    public String name() {
        return name;
    }

    public int score() {
        return score;
    }

    public void addScore(int points) {
        this.score += points;
    }

    public int lives() {
        return lives;
    }

    public boolean isAlive() {
        return lives > 0;
    }

    public void decrementLives() {
        if (this.lives > 0) {
            this.lives--;
        }
    }
}
