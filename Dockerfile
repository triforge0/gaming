# --- build stage: compiles all modules + frontends, produces the fat JAR ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

COPY pom.xml .
COPY proto proto
COPY protocol protocol
COPY engine engine
COPY server server
COPY games games
COPY launcher launcher
COPY frontend frontend

# Declare the build arg and set it as env for Vite compilation during Maven package
ARG VITE_MIXPANEL_TOKEN
ENV VITE_MIXPANEL_TOKEN=$VITE_MIXPANEL_TOKEN

RUN mvn -B -pl launcher/triforge-server -am clean package -DskipTests

# --- runtime stage: slim JRE, only the fat JAR ---
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

COPY --from=build /build/launcher/triforge-server/target/triforge-server-*.jar app.jar

# VPS deployments have no real LAN to broadcast on; disable UDP discovery by
# default and override with SERVER_UDPDISCOVERY=true only for LAN/host-network runs.
ENV SERVER_UDPDISCOVERY=false

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
