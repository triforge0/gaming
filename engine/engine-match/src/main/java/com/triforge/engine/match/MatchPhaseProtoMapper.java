package com.triforge.engine.match;

import com.triforge.protocol.proto.MatchPhase;

/** Maps engine {@link com.triforge.engine.match.MatchPhase} to protobuf wire values. */
public final class MatchPhaseProtoMapper {

    private MatchPhaseProtoMapper() {
    }

    public static MatchPhase toProto(com.triforge.engine.match.MatchPhase phase) {
        return switch (phase) {
            case LOBBY -> MatchPhase.LOBBY;
            case COUNTDOWN -> MatchPhase.COUNTDOWN;
            case PLAYING -> MatchPhase.PLAYING;
            case ENDED -> MatchPhase.ENDED;
        };
    }

    public static com.triforge.engine.match.MatchPhase toDomain(MatchPhase phase) {
        return switch (phase) {
            case LOBBY -> com.triforge.engine.match.MatchPhase.LOBBY;
            case COUNTDOWN -> com.triforge.engine.match.MatchPhase.COUNTDOWN;
            case PLAYING -> com.triforge.engine.match.MatchPhase.PLAYING;
            case ENDED -> com.triforge.engine.match.MatchPhase.ENDED;
            case UNRECOGNIZED -> com.triforge.engine.match.MatchPhase.LOBBY;
        };
    }
}
