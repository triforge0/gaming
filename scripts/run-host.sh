#!/usr/bin/env bash
# Run the Triforge LAN host. Java 24+ needs native access for Netty direct buffers.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
JAR="$ROOT/launcher/triforge-server/target/triforge-server-1.0.0-SNAPSHOT.jar"
PORT="${1:-8080}"

if [[ ! -f "$JAR" ]]; then
  echo "Missing JAR — build first: mvn package -pl launcher/triforge-server -am" >&2
  exit 1
fi

JAVA_OPTS=(
  --enable-native-access=ALL-UNNAMED
)
# Optional: default room plugin for "main" only; "quest" room is always Treasure Quest.
if [[ -n "${TRIFORGE_GAME_PLUGINID:-}" ]]; then
  JAVA_OPTS+=("-Dtriforge.game.pluginId=${TRIFORGE_GAME_PLUGINID}")
fi

exec java "${JAVA_OPTS[@]}" -jar "$JAR" "$PORT"
