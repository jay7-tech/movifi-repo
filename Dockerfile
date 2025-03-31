# Use Java 17 as the base image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy the Maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY backend/pom.xml backend/
COPY frontend/pom.xml frontend/

# Make the mvnw script executable
RUN chmod +x mvnw

# Copy the source code
COPY backend/src backend/src

# Build the application
RUN ./mvnw clean package -DskipTests

# Run the application
CMD ["java", "-jar", "backend/target/*.jar"] 