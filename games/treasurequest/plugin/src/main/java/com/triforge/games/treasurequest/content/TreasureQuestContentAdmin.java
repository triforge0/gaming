package com.triforge.games.treasurequest.content;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

/** Read/write Treasure Quest JSON content for the admin HTTP API. */
public final class TreasureQuestContentAdmin {

    public static final String ADMIN_TOKEN_PROPERTY = "treasurequest.admin.token";

    private TreasureQuestContentAdmin() {
    }

    public static Path runtimeDir() {
        String dir = System.getProperty(ContentSource.DATA_DIR_PROPERTY);
        if (dir != null && !dir.isBlank()) {
            return Path.of(dir);
        }
        return ContentSource.defaultRuntimeDir();
    }

    public static byte[] readQuizzes() throws IOException {
        return readBytes(QuestContent.DEFAULT_QUIZZES);
    }

    public static byte[] readConfig() throws IOException {
        return readBytes(QuestContent.DEFAULT_CONFIG);
    }

    public static byte[] readCheckpoints() throws IOException {
        return QuestMapLoader.readCheckpointOverlay(readSource(), QuestContent.DEFAULT_MAP);
    }

    public static void saveQuizzes(byte[] body) throws IOException {
        validateQuizzes(body);
        writeRuntime(QuestContent.DEFAULT_QUIZZES, body);
        TreasureQuestContentStore.reload();
    }

    public static void saveConfig(byte[] body) throws IOException {
        validateConfig(body);
        writeRuntime(QuestContent.DEFAULT_CONFIG, body);
        TreasureQuestContentStore.reload();
    }

    public static void saveCheckpoints(byte[] overlayBody) throws IOException {
        byte[] mapBytes = readBytes(QuestContent.DEFAULT_MAP);
        byte[] merged = QuestMapLoader.mergeCheckpointOverlay(mapBytes, overlayBody);
        validateMap(merged);
        writeRuntime(QuestContent.DEFAULT_MAP, merged);
        TreasureQuestContentStore.reload();
    }

    private static void validateQuizzes(byte[] body) throws IOException {
        QuizCatalog quizzes = QuizLoader.parseBytes(body);
        QuestContent content = new QuestContent(
                QuestMapLoader.load(readSource(), QuestContent.DEFAULT_MAP),
                quizzes,
                ConfigLoader.load(readSource(), QuestContent.DEFAULT_CONFIG));
        content.map();
    }

    private static void validateConfig(byte[] body) throws IOException {
        ExpeditionConfig config = ConfigLoader.parseBytes(body);
        QuestContent content = new QuestContent(
                QuestMapLoader.load(readSource(), QuestContent.DEFAULT_MAP),
                QuizLoader.load(readSource(), QuestContent.DEFAULT_QUIZZES),
                config);
        content.config();
    }

    private static void validateMap(byte[] mapBytes) throws IOException {
        QuestMap map = QuestMapLoader.parseBytes(mapBytes);
        QuestContent content = new QuestContent(
                map,
                QuizLoader.load(readSource(), QuestContent.DEFAULT_QUIZZES),
                ConfigLoader.load(readSource(), QuestContent.DEFAULT_CONFIG));
        content.map();
    }

    private static ContentSource readSource() {
        return ContentSource.fromSystemProperty();
    }

    private static byte[] readBytes(String relPath) throws IOException {
        try (InputStream in = readSource().open(relPath)) {
            return in.readAllBytes();
        }
    }

    private static void writeRuntime(String relPath, byte[] body) throws IOException {
        Path target = runtimeDir().resolve(relPath);
        Files.createDirectories(target.getParent());
        Files.write(target, body);
    }
}
