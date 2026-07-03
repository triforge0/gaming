package com.triforge.server.transport.netty;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

/** Resolves launcher and game frontends from the classpath JAR or local dev build output. */
final class StaticAssetResolver {
    private static final Logger logger = LoggerFactory.getLogger(StaticAssetResolver.class);
    private static final String STATIC_ROOT_PROPERTY = "triforge.static.root";

    private StaticAssetResolver() {
    }

    record ResolvedAsset(String path, byte[] bytes) {
    }

    static Optional<ResolvedAsset> resolve(String uri) {
        String normalizedUri = normalizeUri(stripQuery(uri));
        Optional<byte[]> fromClasspath = readClasspath("/static" + normalizedUri);
        if (fromClasspath.isPresent()) {
            return Optional.of(new ResolvedAsset(normalizedUri, fromClasspath.get()));
        }
        return readDevFilesystem(normalizedUri).map(bytes -> new ResolvedAsset(normalizedUri, bytes));
    }

    static String contentTypeFor(String path) {
        if (path.endsWith(".html")) {
            return "text/html; charset=UTF-8";
        }
        if (path.endsWith(".js")) {
            return "application/javascript; charset=UTF-8";
        }
        if (path.endsWith(".css")) {
            return "text/css; charset=UTF-8";
        }
        if (path.endsWith(".png")) {
            return "image/png";
        }
        if (path.endsWith(".json")) {
            return "application/json; charset=UTF-8";
        }
        if (path.endsWith(".svg")) {
            return "image/svg+xml";
        }
        return "application/octet-stream";
    }

    private static String stripQuery(String uri) {
        if (uri == null) {
            return "";
        }
        int queryIndex = uri.indexOf('?');
        return queryIndex >= 0 ? uri.substring(0, queryIndex) : uri;
    }

    private static String normalizeUri(String uri) {
        if (uri.isBlank() || "/".equals(uri)) {
            return "/index.html";
        }
        String path = uri.startsWith("/") ? uri : "/" + uri;
        if (path.endsWith("/")) {
            return path + "index.html";
        }
        if (!hasFileExtension(path)) {
            return path + "/index.html";
        }
        return path;
    }

    private static boolean hasFileExtension(String path) {
        int lastSlash = path.lastIndexOf('/');
        int lastDot = path.lastIndexOf('.');
        return lastDot > lastSlash;
    }

    private static Optional<byte[]> readClasspath(String resourcePath) {
        try (InputStream in = StaticAssetResolver.class.getResourceAsStream(resourcePath)) {
            if (in == null) {
                return Optional.empty();
            }
            return Optional.of(in.readAllBytes());
        } catch (IOException e) {
            logger.debug("Failed reading classpath resource {}", resourcePath, e);
            return Optional.empty();
        }
    }

    private static Optional<byte[]> readDevFilesystem(String uri) {
        Optional<Path> file = resolveDevFile(uri);
        if (file.isEmpty()) {
            return Optional.empty();
        }
        try {
            logger.debug("Serving static asset from dev filesystem: {}", file.get());
            return Optional.of(Files.readAllBytes(file.get()));
        } catch (IOException e) {
            logger.debug("Failed reading dev static asset {}", file.get(), e);
            return Optional.empty();
        }
    }

    private static Optional<Path> resolveDevFile(String uri) {
        if (uri.startsWith("/games/tankarena")) {
            Path root = findDistRoot("games/tankarena/frontend/dist");
            if (root == null) {
                return Optional.empty();
            }
            String relative = uri.substring("/games/tankarena".length());
            if (relative.isEmpty() || "/".equals(relative)) {
                relative = "/index.html";
            }
            return resolveUnderRoot(root, relative);
        }
        if (uri.startsWith("/games/treasurequest")) {
            Path root = findDistRoot("games/treasurequest/frontend/dist");
            if (root == null) {
                return Optional.empty();
            }
            String relative = uri.substring("/games/treasurequest".length());
            if (relative.isEmpty() || "/".equals(relative)) {
                relative = "/index.html";
            }
            return resolveUnderRoot(root, relative);
        }

        Path root = configuredRoot().orElseGet(() -> findDistRoot("frontend/launcher-web/dist"));
        if (root == null) {
            return Optional.empty();
        }
        return resolveUnderRoot(root, uri);
    }

    private static Optional<Path> configuredRoot() {
        String configured = System.getProperty(STATIC_ROOT_PROPERTY);
        if (configured == null || configured.isBlank()) {
            return Optional.empty();
        }
        Path root = Path.of(configured.trim()).toAbsolutePath().normalize();
        if (!Files.isDirectory(root)) {
            logger.warn("Configured {} is not a directory: {}", STATIC_ROOT_PROPERTY, root);
            return Optional.empty();
        }
        return Optional.of(root);
    }

    private static Optional<Path> resolveUnderRoot(Path root, String uri) {
        String relative = uri.startsWith("/") ? uri.substring(1) : uri;
        Path file = root.resolve(relative).normalize();
        if (!file.startsWith(root) || !Files.isRegularFile(file)) {
            return Optional.empty();
        }
        return Optional.of(file);
    }

    private static Path findDistRoot(String relativeDistPath) {
        Path cwd = Path.of(System.getProperty("user.dir", ".")).toAbsolutePath().normalize();
        for (int depth = 0; depth <= 5; depth++) {
            Path candidate = cwd.resolve(relativeDistPath).normalize();
            if (Files.isRegularFile(candidate.resolve("index.html"))) {
                return candidate;
            }
            Path parent = cwd.getParent();
            if (parent == null) {
                break;
            }
            cwd = parent;
        }
        return null;
    }
}
