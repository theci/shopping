FROM gradle:8.5-jdk21-alpine AS build

WORKDIR /app

# Copy gradle files
COPY build.gradle settings.gradle ./

# Download dependencies (cache layer)
RUN gradle dependencies --no-daemon --quiet || true

# Copy source code
COPY src ./src

# Build application
RUN gradle bootJar --no-daemon

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
