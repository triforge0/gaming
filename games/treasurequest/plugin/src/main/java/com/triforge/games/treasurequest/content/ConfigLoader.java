package com.triforge.games.treasurequest.content;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;

/** Parses {@code data/config.json} into an {@link ExpeditionConfig}, filling gaps from defaults. */
public final class ConfigLoader {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private ConfigLoader() {
    }

    public static ExpeditionConfig load(ContentSource source, String relPath) throws IOException {
        Objects.requireNonNull(source, "source");
        try (InputStream in = source.open(relPath)) {
            return parseBytes(in.readAllBytes());
        }
    }

    public static ExpeditionConfig parseBytes(byte[] json) throws IOException {
        return merge(MAPPER.readValue(json, ConfigDefinition.class));
    }

    static ExpeditionConfig merge(ConfigDefinition def) {
        ExpeditionConfig d = ExpeditionConfig.defaults();
        if (def == null) {
            return d;
        }
        return new ExpeditionConfig(
                def.encounterRadiusTiles() != null ? def.encounterRadiusTiles() : d.encounterRadiusTiles(),
                def.stealPct() != null ? def.stealPct() : d.stealPct(),
                def.pvpCooldownSecs() != null ? def.pvpCooldownSecs() : d.pvpCooldownSecs(),
                def.stealImmunitySecs() != null ? def.stealImmunitySecs() : d.stealImmunitySecs(),
                def.shieldSecs() != null ? def.shieldSecs() : d.shieldSecs(),
                def.duelQuestionCount() != null ? def.duelQuestionCount() : d.duelQuestionCount(),
                def.duelTimeLimitSecs() != null ? def.duelTimeLimitSecs() : d.duelTimeLimitSecs(),
                def.treasureLockSecs() != null ? def.treasureLockSecs() : d.treasureLockSecs(),
                def.powerKnowledgeWeight() != null ? def.powerKnowledgeWeight() : d.powerKnowledgeWeight()
        );
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    record ConfigDefinition(
            Double encounterRadiusTiles,
            Double stealPct,
            Integer pvpCooldownSecs,
            Integer stealImmunitySecs,
            Integer shieldSecs,
            Integer duelQuestionCount,
            Integer duelTimeLimitSecs,
            Integer treasureLockSecs,
            Double powerKnowledgeWeight
    ) {
    }
}
