package com.triforge.games.f1racing;

import com.triforge.games.f1racing.track.TrackCatalog;
import com.triforge.games.f1racing.track.TrackDefinition;
import com.triforge.games.f1racing.track.TrackLoader;
import com.triforge.games.f1racing.track.TrackSpline;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

final class TrackLoaderTest {

    @Test
    void loadsCityLoopFromClasspath() {
        TrackDefinition track = TrackLoader.loadClasspath("city-loop");

        assertEquals("city-loop", track.id());
        assertEquals("City Loop", track.displayName());
        assertTrue(track.centerline().size() >= 16);
        assertTrue(track.checkpoints().size() >= 8);
        assertTrue(track.startGrid().size() >= 8);
        assertTrue(track.lengthMeters() > 0f);
    }

    @Test
    void catalogIndexesBundledTracks() {
        TrackCatalog catalog = new TrackCatalog();
        assertEquals(8, catalog.require("city-loop").checkpoints().size());
        assertEquals("Forest Lake", catalog.require("forest-lake").displayName());
    }

    @Test
    void centerlineSplineHasPositiveLength() {
        TrackDefinition track = TrackLoader.loadClasspath("city-loop");
        TrackSpline spline = new TrackSpline(track.centerline());
        assertTrue(spline.totalLength() > 500f);
    }

    @Test
    void rejectsMissingTrackResource() {
        assertThrows(IllegalArgumentException.class, () -> TrackLoader.loadClasspath("missing-track"));
    }
}
