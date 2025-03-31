# Use Java 17 as the base image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Install Maven and other dependencies
RUN apk add --no-cache maven bash curl

# Set environment variables
ENV MAVEN_OPTS="-Xmx512m"
ENV JAVA_OPTS="-Xmx512m"
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

# Copy the entire project
COPY . .

# Build the application with error handling
RUN mvn clean package -DskipTests || (echo "Maven build failed" && exit 1)

# Expose the port the app runs on
EXPOSE ${PORT}

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:${PORT}/actuator/health || exit 1

# Run the application with proper error handling and Railway environment variables
CMD ["sh", "-c", "java $JAVA_OPTS -jar backend/target/*.jar"] 