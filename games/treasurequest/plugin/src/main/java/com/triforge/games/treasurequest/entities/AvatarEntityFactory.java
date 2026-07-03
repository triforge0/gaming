package com.triforge.games.treasurequest.entities;

import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.Entity;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.games.treasurequest.components.CanControlComponent;
import com.triforge.games.treasurequest.components.DirectionComponent;
import com.triforge.games.treasurequest.components.InputComponent;
import com.triforge.games.treasurequest.components.PositionComponent;
import com.triforge.games.treasurequest.components.QuestAvatarComponent;
import com.triforge.protocol.proto.Direction;

import java.util.Objects;

/** Assembles controllable avatar entities with the standard ECS component recipe. */
public final class AvatarEntityFactory {

    private AvatarEntityFactory() {
    }

    public static Builder avatar(EntityManager entityManager, ComponentManager componentManager) {
        return new Builder(entityManager, componentManager);
    }

    public static final class Builder {
        private final EntityManager entityManager;
        private final ComponentManager componentManager;

        private Float x;
        private Float y;
        private Direction direction = Direction.DOWN;
        private Long playerId;
        private String playerName;
        private String startCheckpoint;

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

        public Builder player(long playerId, String playerName, String startCheckpoint) {
            this.playerId = playerId;
            this.playerName = Objects.requireNonNull(playerName, "playerName");
            this.startCheckpoint = Objects.requireNonNull(startCheckpoint, "startCheckpoint");
            return this;
        }

        public Entity build() {
            if (x == null || y == null) {
                throw new IllegalStateException("Position is required");
            }
            if (playerId == null || startCheckpoint == null) {
                throw new IllegalStateException("Player and start checkpoint are required");
            }

            Entity avatar = entityManager.create();
            componentManager.add(avatar, new PositionComponent(x, y));
            componentManager.add(avatar, new DirectionComponent(direction));
            componentManager.add(avatar, new InputComponent());
            componentManager.add(avatar, new CanControlComponent());
            componentManager.add(avatar, new QuestAvatarComponent(playerId, playerName, startCheckpoint));
            return avatar;
        }
    }
}
