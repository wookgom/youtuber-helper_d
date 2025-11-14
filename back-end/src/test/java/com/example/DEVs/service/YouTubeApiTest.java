package com.example.DEVs.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootTest
public class YouTubeApiTest {

    WebClient youtubeWebClient;
    @Value("${youtube.api.key}")
    String apiKey;
    String videoId = "7Sg8OLSDryk";

    @BeforeEach
    void setUp() {
        youtubeWebClient = WebClient.builder()
                .baseUrl("https://www.googleapis.com/youtube/v3")
                .build();
    }

    @Test
    void fetchJsonFromUrl() {
        String url = String.format("/videos?part=liveStreamingDetails&id=%s&key=%s", videoId, apiKey);

        String response = youtubeWebClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        System.out.println("\n ✅ API Response:");
        System.out.println(youtubeWebClient.get().uri(url));
        System.out.println(url);
        System.out.println(response);
    }
}
