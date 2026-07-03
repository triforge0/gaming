package com.triforge.server.transport.netty;

import com.triforge.games.treasurequest.content.ContentSource;
import com.triforge.games.treasurequest.content.TreasureQuestContentAdmin;
import com.triforge.games.treasurequest.content.TreasureQuestContentStore;
import io.netty.buffer.Unpooled;
import io.netty.channel.embedded.EmbeddedChannel;
import io.netty.handler.codec.http.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class AdminHttpHandlerTest {

    private Path tempDir;

    @BeforeEach
    void setUp() throws Exception {
        tempDir = Files.createTempDirectory("tq-admin-test");
        System.setProperty(ContentSource.DATA_DIR_PROPERTY, tempDir.toString());
        TreasureQuestContentStore.reload();
    }

    @AfterEach
    void tearDown() throws Exception {
        System.clearProperty(ContentSource.DATA_DIR_PROPERTY);
        System.clearProperty(TreasureQuestContentAdmin.ADMIN_TOKEN_PROPERTY);
        deleteRecursively(tempDir);
    }

    @Test
    void getQuizzesReturnsSeedContent() {
        FullHttpResponse response = sendGet("/api/admin/treasurequest/quizzes");

        assertEquals(HttpResponseStatus.OK, response.status());
        String body = responseBody(response);
        assertTrue(body.contains("\"quizzes\""));
        assertTrue(body.contains("\"q1\""));
    }

    @Test
    void putQuizzesRoundTripPersistsToRuntimeDir() throws Exception {
        byte[] seed = TreasureQuestContentAdmin.readQuizzes();
        FullHttpResponse putResponse = sendPut("/api/admin/treasurequest/quizzes", seed);
        assertEquals(HttpResponseStatus.OK, putResponse.status());

        FullHttpResponse getResponse = sendGet("/api/admin/treasurequest/quizzes");
        assertEquals(HttpResponseStatus.OK, getResponse.status());
        String body = responseBody(getResponse);
        assertTrue(body.contains("\"q1\""));
        assertTrue(body.contains("\"qboss\""));

        assertTrue(Files.isRegularFile(tempDir.resolve("data/quizzes.json")));
    }

    @Test
    void putInvalidQuizzesReturns400() {
        byte[] invalid = "{\"quizzes\":[]}".getBytes(StandardCharsets.UTF_8);
        FullHttpResponse response = sendPut("/api/admin/treasurequest/quizzes", invalid);

        assertEquals(HttpResponseStatus.BAD_REQUEST, response.status());
        assertTrue(responseBody(response).contains("at least one quiz"));
    }

    @Test
    void putConfigRoundTrip() throws Exception {
        byte[] config = TreasureQuestContentAdmin.readConfig();
        FullHttpResponse response = sendPut("/api/admin/treasurequest/config", config);

        assertEquals(HttpResponseStatus.OK, response.status());
        assertTrue(Files.isRegularFile(tempDir.resolve("data/config.json")));
        assertEquals(0.20, TreasureQuestContentStore.current().config().stealPct());
    }

    @Test
    void putInvalidConfigReturns400() {
        byte[] invalid = "{\"stealPct\": 2.0}".getBytes(StandardCharsets.UTF_8);
        FullHttpResponse response = sendPut("/api/admin/treasurequest/config", invalid);

        assertEquals(HttpResponseStatus.BAD_REQUEST, response.status());
        assertTrue(responseBody(response).contains("stealPct"));
    }

    @Test
    void getCheckpointsReturnsOverlayShape() {
        FullHttpResponse response = sendGet("/api/admin/treasurequest/checkpoints");

        assertEquals(HttpResponseStatus.OK, response.status());
        String body = responseBody(response);
        assertTrue(body.contains("\"checkpoints\""));
        assertTrue(body.contains("\"cp1\""));
        assertTrue(body.contains("\"treasure\""));
        assertTrue(body.contains("\"tileSize\""));
    }

    @Test
    void putCheckpointsRoundTrip() throws Exception {
        byte[] overlay = TreasureQuestContentAdmin.readCheckpoints();
        FullHttpResponse response = sendPut("/api/admin/treasurequest/checkpoints", overlay);

        assertEquals(HttpResponseStatus.OK, response.status());
        assertTrue(Files.isRegularFile(tempDir.resolve("maps/quest-village.json")));
    }

    @Test
    void unknownAdminPathReturns404() {
        FullHttpResponse response = sendGet("/api/admin/treasurequest/unknown");
        assertEquals(HttpResponseStatus.NOT_FOUND, response.status());
    }

    @Test
    void rejectsWhenAdminTokenMismatch() {
        System.setProperty(TreasureQuestContentAdmin.ADMIN_TOKEN_PROPERTY, "secret");

        FullHttpResponse response = sendGet("/api/admin/treasurequest/config");
        assertEquals(HttpResponseStatus.UNAUTHORIZED, response.status());
    }

    private FullHttpResponse sendGet(String path) {
        EmbeddedChannel channel = new EmbeddedChannel(new AdminHttpHandler());
        channel.writeInbound(new DefaultFullHttpRequest(HttpVersion.HTTP_1_1, HttpMethod.GET, path));
        FullHttpResponse response = channel.readOutbound();
        channel.finish();
        return response;
    }

    private FullHttpResponse sendPut(String path, byte[] body) {
        EmbeddedChannel channel = new EmbeddedChannel(new AdminHttpHandler());
        DefaultFullHttpRequest request =
                new DefaultFullHttpRequest(HttpVersion.HTTP_1_1, HttpMethod.PUT, path, Unpooled.wrappedBuffer(body));
        request.headers().set(HttpHeaderNames.CONTENT_LENGTH, body.length);
        channel.writeInbound(request);
        FullHttpResponse response = channel.readOutbound();
        channel.finish();
        return response;
    }

    private static String responseBody(FullHttpResponse response) {
        return response.content().toString(StandardCharsets.UTF_8);
    }

    private static void deleteRecursively(Path root) throws Exception {
        if (root == null || !Files.exists(root)) {
            return;
        }
        try (var walk = Files.walk(root)) {
            walk.sorted(java.util.Comparator.reverseOrder()).forEach(path -> {
                try {
                    Files.deleteIfExists(path);
                } catch (Exception ignored) {
                }
            });
        }
    }
}
