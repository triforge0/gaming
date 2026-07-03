package com.triforge.games.treasurequest.content;

import java.util.Objects;

/** The final zone; the first avatar to enter it after clearing the boss wins (first-to-treasure). */
public record TreasureZone(Rect zone) {

    public TreasureZone {
        zone = Objects.requireNonNull(zone, "zone");
    }
}
