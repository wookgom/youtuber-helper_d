# Build Stage
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app
# Copy only backend source (assuming context is root)
COPY back-end/ .
# Grant execution rights on gradlew
RUN chmod +x ./gradlew
# Build the application
RUN ./gradlew build -x test

# Run Stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Install Python and Pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Copy Jar
COPY --from=builder /app/build/libs/*.jar app.jar

# Copy Sentiment Analyzer Script and Requirements
COPY sentimentAnalyzer/ /sentimentAnalyzer/

# Install Python Dependencies
RUN pip3 install -r /sentimentAnalyzer/requirements.txt

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
