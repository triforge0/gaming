package com.triforge.games.tankarena.entities;

import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.Entity;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.games.tankarena.components.CanControlComponent;
import com.triforge.games.tankarena.components.DirectionComponent;
import com.triforge.games.tankarena.components.InputComponent;
import com.triforge.games.tankarena.components.PlayerComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.components.TankComponent;
import com.triforge.games.tankarena.components.VisionComponent;
import com.triforge.games.tankarena.map.MapConfig;
import com.triforge.games.tankarena.match.Team;
import com.triforge.protocol.proto.Direction;
import com.triforge.protocol.proto.InputCommand;

import java.util.Objects;

/** Assembles tank entities with the standard ECS component recipe. */
public final class TankEntityFactory {

    private TankEntityFactory() {
    }

    public static Builder tank(EntityManager entityManager, ComponentManager componentManager) {
        return new Builder(entityManager, componentManager);
    }

    public static final class Builder {
        private final EntityManager entityManager;
        private final ComponentManager componentManager;

        private Float x;
        private Float y;
        private Direction direction;
        private Long playerId;
        private String playerName;
        private int lives = PlayerComponent.DEFAULT_LIVES;
        private Team team = Team.NONE;
        private boolean input;
        private InputCommand initialInput;
        private boolean controllable;
        private MapConfig visionConfig;
        private int visionTileSize;

        private Builder(EntityManager entityManager, ComponentManager componentManager) {
            this.entityManager = Objects.requireNonNull(entityManager, "entityManager");
            this.componentManager = Objects.requireNonNull(componentManager, "componentManager");
        }

        public Builder at(float x, float y) {
            this.x = x;
            this.y = y;
            return this;
        }

        public Builder direction(Direction direction) {
            this.direction = Objects.requireNonNull(direction, "direction");
            return this;
        }

        public Builder player(long playerId, String playerName) {
            return player(playerId, playerName, PlayerComponent.DEFAULT_LIVES, Team.NONE);
        }

        public Builder player(long playerId, String playerName, int lives, Team team) {
            this.playerId = playerId;
            this.playerName = Objects.requireNonNull(playerName, "playerName");
            this.lives = lives;
            this.team = team == null ? Team.NONE : team;
            return this;
        }

        public Builder withInput() {
            this.input = true;
            return this;
        }

        public Builder withInput(InputCommand initialInput) {
            this.input = true;
            this.initialInput = Objects.requireNonNull(initialInput, "initialInput");
            return this;
        }

        public Builder controllable() {
            this.controllable = true;
            return this;
        }

        public Builder vision(MapConfig mapConfig, int tileSize) {
            this.visionConfig = Objects.requireNonNull(mapConfig, "mapConfig");
            if (tileSize < 1) {
                throw new IllegalArgumentException("tileSize must be positive");
            }
            this.visionTileSize = tileSize;
            return this;
        }

        public Entity build() {
            if (x == null || y == null) {
                throw new IllegalStateException("Position is required");
            }

            Entity tank = entityManager.create();
            componentManager.add(tank, new PositionComponent(x, y));
            if (direction != null) {
                componentManager.add(tank, new DirectionComponent(direction));
            }
            componentManager.add(tank, new TankComponent());
            if (input) {
                InputComponent inputComponent = new InputComponent();
                if (initialInput != null) {
                    inputComponent.apply(initialInput);
                }
                componentManager.add(tank, inputComponent);
            }
            if (playerId != null) {
                componentManager.add(tank, new PlayerComponent(playerId, playerName, lives, team));
            }
            if (controllable) {
                componentManager.add(tank, new CanControlComponent());
            }
            if (visionConfig != null) {
                componentManager.add(tank, new VisionComponent(
                        visionConfig.visionRadiusWorld(),
                        visionConfig.defaultFovDegrees(),
                        visionConfig.visionRadiusTiles(visionTileSize)
                ));
            }
            return tank;
        }
    }
}
