package com.triforge.server.transport.netty;

import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class StaticAssetResolverTest {

    @Test
    void resolvesLauncherIndexFromDevDistWhenPresent() throws Exception {
        Path repoRoot = Path.of(System.getProperty("user.dir")).toAbsolutePath().normalize();
        while (repoRoot != null && !Files.isDirectory(repoRoot.resolve("frontend/launcher-web/dist"))) {
            repoRoot = repoRoot.getParent();
        }
        if (repoRoot == null) {
            return;
        }

        Optional<StaticAssetResolver.ResolvedAsset> asset = StaticAssetResolver.resolve("/index.html");
        assertTrue(asset.isPresent());
        assertTrue(new String(asset.get().bytes()).contains("<!DOCTYPE html>") || new String(asset.get().bytes()).contains("<html"));
    }

    @Test
    void directoryRequestsUseHtmlContentType() {
        Optional<StaticAssetResolver.ResolvedAsset> asset = StaticAssetResolver.resolve("/games/tankarena");
        assertTrue(asset.isPresent());
        assertEquals("/games/tankarena/index.html", asset.get().path());
        assertEquals("text/html; charset=UTF-8", StaticAssetResolver.contentTypeFor(asset.get().path()));
    }

    @Test
    void resolvesTankArenaIndexWithoutTrailingSlash() {
        Optional<StaticAssetResolver.ResolvedAsset> asset = StaticAssetResolver.resolve("/games/tankarena");
        assertTrue(asset.isPresent());
        String html = new String(asset.get().bytes());
        assertTrue(html.contains("Tank Arena") || html.contains("<!DOCTYPE html>"));
    }

    @Test
    void resolvesTreasureQuestIndexWithoutTrailingSlash() {
        Optional<StaticAssetResolver.ResolvedAsset> asset = StaticAssetResolver.resolve("/games/treasurequest");
        assertTrue(asset.isPresent());
        String html = new String(asset.get().bytes());
        assertTrue(html.contains("Treasure Quest") || html.contains("<!DOCTYPE html>"));
    }

    @Test
    void rejectsDirectoryTraversal() {
        assertFalse(StaticAssetResolver.resolve("/../secret").isPresent());
    }
}
