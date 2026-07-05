package com.triforge.games.f1racing.replay;

/** Per-driver metadata captured once per replay sample. */
public record ReplayDriverMeta(String displayName, boolean bot, String carId, String primaryColor) {}
