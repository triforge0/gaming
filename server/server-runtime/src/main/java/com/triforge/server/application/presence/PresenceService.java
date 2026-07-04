package com.triforge.server.application.presence;

import com.triforge.server.transport.discovery.RoomSummary;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class PresenceService {
    private static final long PRESENCE_TTL_MS = 60_000;
    
    // appId -> sessionId -> lastSeenMs
    private final Map<String, Map<String, Long>> presences = new ConcurrentHashMap<>();

    public void heartbeat(String appId, String sessionId) {
        presences.computeIfAbsent(appId, k -> new ConcurrentHashMap<>())
                 .put(sessionId, System.currentTimeMillis());
    }

    public List<RoomSummary> getVirtualRooms() {
        long now = System.currentTimeMillis();
        List<RoomSummary> virtualRooms = new ArrayList<>();
        
        for (Map.Entry<String, Map<String, Long>> entry : presences.entrySet()) {
            String appId = entry.getKey();
            Map<String, Long> sessions = entry.getValue();
            
            sessions.entrySet().removeIf(e -> now - e.getValue() > PRESENCE_TTL_MS);
            
            if (!sessions.isEmpty()) {
                virtualRooms.add(new RoomSummary(
                        "presence-" + appId,
                        "Single Player",
                        sessions.size(),
                        sessions.size(),
                        appId,
                        appId
                ));
            }
        }
        return virtualRooms;
    }
}
