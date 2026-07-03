package com.triforge.games.treasurequest.content;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.Objects;

/**
 * Aggregate of a loaded expedition: map (with checkpoint graph + treasure), quiz catalog, and config.
 * Cross-validates that every checkpoint references an existing quiz before a room uses the content.
 */
public final class QuestContent {

    public static final String DEFAULT_MAP = "maps/quest-village.json";
    public static final String DEFAULT_QUIZZES = "data/quizzes.json";
    public static final String DEFAULT_CONFIG = "data/config.json";

    private final QuestMap map;
    private final QuizCatalog quizzes;
    private final ExpeditionConfig config;

    public QuestContent(QuestMap map, QuizCatalog quizzes, ExpeditionConfig config) {
        this.map = Objects.requireNonNull(map, "map");
        this.quizzes = Objects.requireNonNull(quizzes, "quizzes");
        this.config = Objects.requireNonNull(config, "config");
        crossValidate();
    }

    private void crossValidate() {
        for (Checkpoint checkpoint : map.checkpoints().all()) {
            if (!quizzes.has(checkpoint.quizId())) {
                throw new IllegalArgumentException(
                        "Checkpoint '" + checkpoint.id() + "' references unknown quiz '" + checkpoint.quizId() + "'");
            }
        }
    }

    /** Loads the default seed expedition, honouring a runtime data-dir override. */
    public static QuestContent loadDefault(ContentSource source) {
        try {
            return new QuestContent(
                    QuestMapLoader.load(source, DEFAULT_MAP),
                    QuizLoader.load(source, DEFAULT_QUIZZES),
                    ConfigLoader.load(source, DEFAULT_CONFIG));
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to load TreasureQuest content", e);
        }
    }

    public QuestMap map() {
        return map;
    }

    public QuizCatalog quizzes() {
        return quizzes;
    }

    public ExpeditionConfig config() {
        return config;
    }
}
