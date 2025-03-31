# Use Java 17 as the base image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Install Maven and other dependencies
RUN apk add --no-cache maven bash

# Set environment variables
ENV MAVEN_OPTS="-Xmx512m"
ENV JAVA_OPTS="-Xmx512m"

# Copy the entire project
COPY . .

# Build the application with error handling
RUN mvn clean package -DskipTests || (echo "Maven build failed" && exit 1)

# Expose the port the app runs on
EXPOSE 8080

# Run the application with proper error handling
CMD ["sh", "-c", "java $JAVA_OPTS -jar backend/target/*.jar"] 