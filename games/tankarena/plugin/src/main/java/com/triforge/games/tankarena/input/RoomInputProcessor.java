package com.triforge.games.tankarena.input;

import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.Entity;
import com.triforge.games.tankarena.components.InputComponent;
import com.triforge.protocol.proto.InputCommand;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

/** Buffers per-player input commands and applies them to ECS once per tick. */
public final class RoomInputProcessor {
    private final Map<Long, InputCommand> inputQueue = new LinkedHashMap<>();

    public void queue(long playerId, InputCommand input) {
        Objects.requireNonNull(input, "input");
        inputQueue.put(playerId, input);
    }

    public void remove(long playerId) {
        inputQueue.remove(playerId);
    }

    public void clear() {
        inputQueue.clear();
    }

    public void process(Map<Long, Entity> playerEntities, ComponentManager componentManager) {
        for (Map.Entry<Long, InputCommand> entry : inputQueue.entrySet()) {
            apply(entry.getKey(), entry.getValue(), playerEntities, componentManager);
        }
        inputQueue.clear();
    }

    private static void apply(
            long playerId,
            InputCommand input,
            Map<Long, Entity> playerEntities,
            ComponentManager componentManager
    ) {
        Entity entity = playerEntities.get(playerId);
        if (entity == null) {
            return;
        }
        InputComponent inputComponent = componentManager.get(entity, InputComponent.class);
        if (inputComponent != null) {
            inputComponent.apply(input);
        }
    }
}
