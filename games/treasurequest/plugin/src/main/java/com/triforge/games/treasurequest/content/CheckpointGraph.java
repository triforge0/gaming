package com.triforge.games.treasurequest.content;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

/**
 * Directed checkpoint graph (branching routes → merge → boss). Validates on construction: unique ids,
 * a valid start, every {@code next} edge resolves, at least one boss, and the boss is reachable.
 */
public final class CheckpointGraph {

    private final Map<String, Checkpoint> byId;
    private final String startId;

    public CheckpointGraph(List<Checkpoint> checkpoints, String startId) {
        Objects.requireNonNull(checkpoints, "checkpoints");
        this.startId = Objects.requireNonNull(startId, "startId");
        if (checkpoints.isEmpty()) {
            throw new IllegalArgumentException("Checkpoint graph must have at least one node");
        }

        Map<String, Checkpoint> map = new LinkedHashMap<>();
        for (Checkpoint checkpoint : checkpoints) {
            if (map.put(checkpoint.id(), checkpoint) != null) {
                throw new IllegalArgumentException("Duplicate checkpoint id: " + checkpoint.id());
            }
        }
        this.byId = map;

        validate();
    }

    private void validate() {
        if (!byId.containsKey(startId)) {
            throw new IllegalArgumentException("Start checkpoint not found: " + startId);
        }
        for (Checkpoint checkpoint : byId.values()) {
            for (String nextId : checkpoint.next()) {
                if (!byId.containsKey(nextId)) {
                    throw new IllegalArgumentException(
                            "Checkpoint '" + checkpoint.id() + "' points to unknown next '" + nextId + "'");
                }
            }
        }
        Set<String> reachable = reachableFromStart();
        boolean bossReachable = byId.values().stream()
                .anyMatch(cp -> cp.boss() && reachable.contains(cp.id()));
        if (byId.values().stream().noneMatch(Checkpoint::boss)) {
            throw new IllegalArgumentException("Checkpoint graph must contain a boss checkpoint");
        }
        if (!bossReachable) {
            throw new IllegalArgumentException("Boss checkpoint is not reachable from start '" + startId + "'");
        }
    }

    private Set<String> reachableFromStart() {
        Set<String> seen = new HashSet<>();
        Deque<String> queue = new ArrayDeque<>();
        queue.add(startId);
        seen.add(startId);
        while (!queue.isEmpty()) {
            Checkpoint current = byId.get(queue.poll());
            for (String nextId : current.next()) {
                if (seen.add(nextId)) {
                    queue.add(nextId);
                }
            }
        }
        return seen;
    }

    public Checkpoint start() {
        return byId.get(startId);
    }

    public Checkpoint get(String id) {
        return byId.get(id);
    }

    public boolean has(String id) {
        return byId.containsKey(id);
    }

    public List<Checkpoint> successors(String id) {
        Checkpoint checkpoint = byId.get(id);
        if (checkpoint == null) {
            return List.of();
        }
        return checkpoint.next().stream().map(byId::get).toList();
    }

    public Optional<Checkpoint> boss() {
        return byId.values().stream().filter(Checkpoint::boss).findFirst();
    }

    public java.util.Collection<Checkpoint> all() {
        return byId.values();
    }

    public int size() {
        return byId.size();
    }
}
