package com.triforge.games.treasurequest.content;

import com.triforge.protocol.proto.TileType;

/** Lean tile vocabulary for the adventure world: floors, solid walls, water, and passable trees. */
public enum QuestTileType {
    EMPTY,
    WALL,
    WATER,
    TREE;

    /** WALL and WATER block avatar movement; EMPTY and TREE are walkable (TREE is decorative cover). */
    public boolean blocksMovement() {
        return this == WALL || this == WATER;
    }

    public TileType toProto() {
        return switch (this) {
            case EMPTY -> TileType.EMPTY;
            case WALL -> TileType.STEEL;
            case WATER -> TileType.WATER;
            case TREE -> TileType.TREE;
        };
    }

    public static QuestTileType fromSymbol(char symbol) {
        return switch (symbol) {
            case '.', ' ' -> EMPTY;
            case '#', 'W' -> WALL;
            case '~' -> WATER;
            case 'T' -> TREE;
            default -> throw new IllegalArgumentException("Unknown tile symbol: '" + symbol + "'");
        };
    }
}
