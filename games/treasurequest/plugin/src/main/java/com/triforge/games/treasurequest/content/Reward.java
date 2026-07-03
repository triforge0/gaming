package com.triforge.games.treasurequest.content;

/** Reward granted for clearing a checkpoint: bonus points and an optional item id (formalised in T17). */
public record Reward(int bonusPoints, String item) {

    public static final Reward NONE = new Reward(0, null);

    public Reward {
        if (bonusPoints < 0) {
            throw new IllegalArgumentException("bonusPoints must be >= 0");
        }
        if (item != null && item.isBlank()) {
            item = null;
        }
    }

    public boolean hasItem() {
        return item != null;
    }
}
