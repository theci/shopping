FROM gradle:8.5-jdk21-alpine AS build

WORKDIR /app

# Copy gradle wrapper files
COPY gradlew ./
COPY gradle ./gradle
COPY build.gradle settings.gradle ./

# Download dependencies (cache layer)
RUN ./gradlew dependencies --no-daemon --quiet || true

# Copy source code
COPY src ./src

# Build application (compileJava generates QueryDSL Q-classes)
RUN ./gradlew clean compileJava --no-daemon && \
    ./gradlew bootJar --no-daemon -x test

# Production stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xms512m -Xmx1024m"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
