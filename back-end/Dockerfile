# Build Stage
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app
COPY . .
# Grant execution rights on gradlew
RUN chmod +x ./gradlew
# Build the application
RUN ./gradlew build -x test

# Run Stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
