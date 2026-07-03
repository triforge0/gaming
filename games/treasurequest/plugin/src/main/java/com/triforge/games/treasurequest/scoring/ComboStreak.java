package com.triforge.games.treasurequest.scoring;

/** Consecutive quiz-pass streak for the combo component of Power. */
public final class ComboStreak {

    private int value;

    public void onQuizPass() {
        value++;
    }

    public void onQuizFail() {
        value = 0;
    }

    public int value() {
        return value;
    }
}
