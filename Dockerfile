# Use Java 17 as the base image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Install Maven
RUN apk add --no-cache maven

# Copy the entire project
COPY . .

# Build the application
RUN mvn clean package -DskipTests

# Run the application
CMD ["java", "-jar", "backend/target/*.jar"] 