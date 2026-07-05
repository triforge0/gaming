package com.triforge.games.f1racing.track;

import java.util.List;

/** Polyline centerline queries for arcade vehicle constraint. */
public final class TrackSpline {

    public record Projection(
            float centerX,
            float centerY,
            float heading,
            float lateralDistance,
            float alongDistance
    ) {
    }

    private final float[] segStartX;
    private final float[] segStartY;
    private final float[] segEndX;
    private final float[] segEndY;
    private final float[] segLength;
    private final float[] segHeading;
    private final float[] cumulativeLength;
    private final float totalLength;

    public TrackSpline(List<TrackPoint> centerline) {
        int n = centerline.size();
        int segCount = n;
        segStartX = new float[segCount];
        segStartY = new float[segCount];
        segEndX = new float[segCount];
        segEndY = new float[segCount];
        segLength = new float[segCount];
        segHeading = new float[segCount];
        cumulativeLength = new float[segCount + 1];

        float total = 0f;
        for (int i = 0; i < segCount; i++) {
            TrackPoint start = centerline.get(i);
            TrackPoint end = centerline.get((i + 1) % n);
            segStartX[i] = start.x();
            segStartY[i] = start.y();
            segEndX[i] = end.x();
            segEndY[i] = end.y();
            float dx = end.x() - start.x();
            float dy = end.y() - start.y();
            float len = (float) Math.sqrt(dx * dx + dy * dy);
            if (len < 1e-4f) {
                len = 1e-4f;
            }
            segLength[i] = len;
            segHeading[i] = (float) Math.atan2(dy, dx);
            cumulativeLength[i] = total;
            total += len;
        }
        cumulativeLength[segCount] = total;
        totalLength = total;
    }

    public float totalLength() {
        return totalLength;
    }

    public Projection project(float x, float y) {
        float bestDistSq = Float.MAX_VALUE;
        int bestSeg = 0;
        float bestT = 0f;
        float bestCx = x;
        float bestCy = y;

        for (int i = 0; i < segStartX.length; i++) {
            float ax = segStartX[i];
            float ay = segStartY[i];
            float bx = segEndX[i];
            float by = segEndY[i];
            float dx = bx - ax;
            float dy = by - ay;
            float lenSq = dx * dx + dy * dy;
            float t = lenSq <= 1e-6f ? 0f : clamp01(((x - ax) * dx + (y - ay) * dy) / lenSq);
            float cx = ax + dx * t;
            float cy = ay + dy * t;
            float distSq = (x - cx) * (x - cx) + (y - cy) * (y - cy);
            if (distSq < bestDistSq) {
                bestDistSq = distSq;
                bestSeg = i;
                bestT = t;
                bestCx = cx;
                bestCy = cy;
            }
        }

        float lateral = signedLateral(
                x, y,
                segStartX[bestSeg], segStartY[bestSeg],
                segEndX[bestSeg], segEndY[bestSeg]);
        float along = cumulativeLength[bestSeg] + segLength[bestSeg] * bestT;
        return new Projection(bestCx, bestCy, segHeading[bestSeg], lateral, along);
    }

    public float headingAt(float alongDistance) {
        float d = normalizeAlong(alongDistance);
        for (int i = 0; i < segLength.length; i++) {
            if (d <= cumulativeLength[i + 1]) {
                return segHeading[i];
            }
        }
        return segHeading[segHeading.length - 1];
    }

    public float normalizeAlong(float alongDistance) {
        if (totalLength <= 0f) {
            return 0f;
        }
        float d = alongDistance % totalLength;
        if (d < 0f) {
            d += totalLength;
        }
        return d;
    }

    private static float signedLateral(float px, float py, float ax, float ay, float bx, float by) {
        float dx = bx - ax;
        float dy = by - ay;
        float len = (float) Math.sqrt(dx * dx + dy * dy);
        if (len < 1e-6f) {
            return 0f;
        }
        return ((px - ax) * (-dy) + (py - ay) * dx) / len;
    }

    private static float clamp01(float value) {
        return Math.max(0f, Math.min(1f, value));
    }
}
