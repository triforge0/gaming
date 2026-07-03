package com.triforge.games.treasurequest.content;

/** Cached expedition content reloaded after admin saves. */
public final class TreasureQuestContentStore {

    private static volatile QuestContent cached;

    private TreasureQuestContentStore() {
    }

    public static QuestContent current() {
        QuestContent local = cached;
        if (local != null) {
            return local;
        }
        synchronized (TreasureQuestContentStore.class) {
            if (cached == null) {
                cached = QuestContent.loadDefault(ContentSource.fromSystemProperty());
            }
            return cached;
        }
    }

    public static void reload() {
        synchronized (TreasureQuestContentStore.class) {
            cached = QuestContent.loadDefault(ContentSource.fromSystemProperty());
        }
    }
}
