package com.triforge.games.tankarena.vision;

import com.triforge.games.tankarena.components.PlayerComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.components.VisionComponent;
import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.MapConfig;
import com.triforge.games.tankarena.map.VisibilityMap;

import java.util.Objects;

/**
 * Per-player field of view via recursive shadowcasting. Each recompute visits every tile inside the
 * vision radius at most once across the 8 octants — O(radius^2) per player — instead of casting an
 * independent ray to each cell (which was O(radius^3)). No allocation happens in the inner loop.
 */
public final class FogOfWarCalculator {
    // Octant transforms: (xx, xy, yx, yy) per octant, indexed 0..7.
    private static final int[] MULT_XX = {1, 0, 0, -1, -1, 0, 0, 1};
    private static final int[] MULT_XY = {0, 1, -1, 0, 0, -1, 1, 0};
    private static final int[] MULT_YX = {0, 1, 1, 0, 0, -1, -1, 0};
    private static final int[] MULT_YY = {1, 0, 0, 1, -1, 0, 0, -1};

    private final GameMap map;
    private final MapConfig config;
    private final RoomVisionState visionState;

    public FogOfWarCalculator(GameMap map, MapConfig config, RoomVisionState visionState) {
        this.map = Objects.requireNonNull(map, "map");
        this.config = Objects.requireNonNull(config, "config");
        this.visionState = Objects.requireNonNull(visionState, "visionState");
    }

    public void recomputeAll(EntityManager entityManager, ComponentManager componentManager) {
        for (int index = 0; index < entityManager.count(); index++) {
            PlayerComponent player = componentManager.getAt(index, PlayerComponent.class);
            PositionComponent position = componentManager.getAt(index, PositionComponent.class);
            VisionComponent vision = componentManager.getAt(index, VisionComponent.class);
            if (player == null || position == null || vision == null) {
                continue;
            }
            recomputePlayer(player.playerId(), position, vision);
        }
    }

    public void recomputePlayer(long playerId, PositionComponent position, VisionComponent vision) {
        VisibilityMap visibility = visionState.visibilityFor(playerId);
        visibility.beginFrame();
        recompute(position.x(), position.y(), vision, visibility);
    }

    public void recompute(float worldX, float worldY, VisionComponent vision, VisibilityMap visibility) {
        int centerTileX = map.worldToTileX(worldX);
        int centerTileY = map.worldToTileY(worldY);
        int radiusTiles = vision.radiusTiles();

        // The observer's own tile is always visible (even if it is a cover tile).
        visibility.setVisible(centerTileX, centerTileY);

        for (int octant = 0; octant < 8; octant++) {
            castLight(visibility, centerTileX, centerTileY, radiusTiles, 1, 1.0, 0.0, octant);
        }
    }

    private void castLight(
            VisibilityMap visibility,
            int centerX,
            int centerY,
            int radius,
            int row,
            double startSlope,
            double endSlope,
            int octant
    ) {
        if (startSlope < endSlope) {
            return;
        }
        int radiusSquared = radius * radius;
        double nextStartSlope = 0.0;
        boolean blocked = false;

        for (int distance = row; distance <= radius && !blocked; distance++) {
            int deltaY = -distance;
            for (int deltaX = -distance; deltaX <= 0; deltaX++) {
                int currentX = centerX + deltaX * MULT_XX[octant] + deltaY * MULT_XY[octant];
                int currentY = centerY + deltaX * MULT_YX[octant] + deltaY * MULT_YY[octant];
                double leftSlope = (deltaX - 0.5) / (deltaY + 0.5);
                double rightSlope = (deltaX + 0.5) / (deltaY - 0.5);

                if (!map.inBounds(currentX, currentY) || startSlope < rightSlope) {
                    continue;
                }
                if (endSlope > leftSlope) {
                    break;
                }

                if (deltaX * deltaX + deltaY * deltaY <= radiusSquared) {
                    visibility.setVisible(currentX, currentY);
                }

                boolean opaque = map.tileAt(currentX, currentY).blocksVision();
                if (blocked) {
                    if (opaque) {
                        nextStartSlope = rightSlope;
                        continue;
                    }
                    blocked = false;
                    startSlope = nextStartSlope;
                } else if (opaque && distance < radius) {
                    // Opaque cell within range: recurse for the still-lit sector beside it,
                    // then keep scanning this row behind the new shadow.
                    blocked = true;
                    castLight(visibility, centerX, centerY, radius, distance + 1, startSlope, leftSlope, octant);
                    nextStartSlope = rightSlope;
                }
            }
        }
    }
}
