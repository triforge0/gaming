package com.triforge.games.tankarena.sync;

import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.HeadquartersDefinition;
import com.triforge.games.tankarena.map.TileType;
import com.triforge.games.tankarena.match.MatchProtoMapper;
import com.triforge.protocol.proto.HeadquartersProto;
import com.triforge.protocol.proto.MapSnapshot;

public final class TankArenaMapSnapshotService {

    private TankArenaMapSnapshotService() {
    }

    public static MapSnapshot toProto(GameMap map) {
        MapSnapshot.Builder builder = MapSnapshot.newBuilder()
                .setWidth(map.width())
                .setHeight(map.height())
                .setTileSize(map.tileSize());

        for (TileType tile : map.copyTiles()) {
            builder.addTiles(toProtoTile(tile));
        }
        if (!map.isFlat()) {
            for (float elevation : map.copyHeights()) {
                builder.addHeights(elevation);
            }
        }
        for (HeadquartersDefinition hq : map.headquarters()) {
            builder.addHeadquarters(HeadquartersProto.newBuilder()
                    .setTeam(MatchProtoMapper.toProto(hq.team()))
                    .setX(hq.minTileX())
                    .setY(hq.minTileY())
                    .setWidth(hq.maxTileX() - hq.minTileX() + 1)
                    .setHeight(hq.maxTileY() - hq.minTileY() + 1)
                    .setMaxHp(hq.maxHp())
                    .build());
        }
        return builder.build();
    }

    public static com.triforge.protocol.proto.TileType toProtoTile(TileType tile) {
        return switch (tile) {
            case EMPTY -> com.triforge.protocol.proto.TileType.EMPTY;
            case BRICK -> com.triforge.protocol.proto.TileType.BRICK;
            case STEEL -> com.triforge.protocol.proto.TileType.STEEL;
            case WATER -> com.triforge.protocol.proto.TileType.WATER;
            case TREE -> com.triforge.protocol.proto.TileType.TREE;
            case HQ -> com.triforge.protocol.proto.TileType.HQ;
        };
    }

    public static TileType fromProtoTile(com.triforge.protocol.proto.TileType tile) {
        return switch (tile) {
            case EMPTY -> TileType.EMPTY;
            case BRICK -> TileType.BRICK;
            case STEEL -> TileType.STEEL;
            case WATER -> TileType.WATER;
            case TREE -> TileType.TREE;
            case HQ -> TileType.HQ;
            case WALL -> TileType.STEEL;
            case COVER -> TileType.TREE;
            default -> TileType.EMPTY;
        };
    }
}
