package com.triforge.games.treasurequest.content;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Resolves quest content, preferring a writable runtime directory (admin-authored, survives
 * restarts) over the classpath seed bundled in the plugin jar. The runtime directory is set with
 * {@code -Dtreasurequest.data.dir=<path>}; when unset or missing a file, the classpath seed is used.
 */
public final class ContentSource {

    public static final String DATA_DIR_PROPERTY = "treasurequest.data.dir";

    private final Path runtimeDir;

    public ContentSource(Path runtimeDir) {
        this.runtimeDir = runtimeDir;
    }

    /** Classpath-only source (no runtime override) — the bundled seed content. */
    public static ContentSource classpathOnly() {
        return new ContentSource(null);
    }

    /** Reads the {@value #DATA_DIR_PROPERTY} system property for the runtime override directory. */
    public static ContentSource fromSystemProperty() {
        String dir = System.getProperty(DATA_DIR_PROPERTY);
        if (dir != null && !dir.isBlank()) {
            return new ContentSource(Path.of(dir));
        }
        Path defaultDir = defaultRuntimeDir();
        if (hasOverrideContent(defaultDir)) {
            return new ContentSource(defaultDir);
        }
        return classpathOnly();
    }

    /** Writable runtime directory used by the admin API when the system property is unset. */
    public static Path defaultRuntimeDir() {
        return Path.of(System.getProperty("user.home"), ".triforge", "treasurequest-data");
    }

    public Path runtimeDirOrNull() {
        return runtimeDir;
    }

    private static boolean hasOverrideContent(Path dir) {
        if (!Files.isDirectory(dir)) {
            return false;
        }
        return Files.isRegularFile(dir.resolve(QuestContent.DEFAULT_CONFIG))
                || Files.isRegularFile(dir.resolve(QuestContent.DEFAULT_QUIZZES))
                || Files.isRegularFile(dir.resolve(QuestContent.DEFAULT_MAP));
    }

    /**
     * Opens {@code relPath} (e.g. {@code "maps/quest-village.json"}). Runtime dir first, then the
     * classpath. Caller closes the stream.
     */
    public InputStream open(String relPath) throws IOException {
        if (runtimeDir != null) {
            Path candidate = runtimeDir.resolve(relPath);
            if (Files.isRegularFile(candidate)) {
                return Files.newInputStream(candidate);
            }
        }
        InputStream classpath = ContentSource.class.getClassLoader().getResourceAsStream(relPath);
        if (classpath == null) {
            throw new IOException("Quest content not found (runtime dir or classpath): " + relPath);
        }
        return classpath;
    }
}
