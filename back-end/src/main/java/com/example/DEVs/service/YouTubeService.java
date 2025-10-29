package com.example.DEVs.service;

import com.example.DEVs.entity.Chat;
import com.example.DEVs.repository.ChatRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class YouTubeService {

    private final ChatRepository chatRepository;
    private final WebClient youtubeWebClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;

    // JSON 가져오기 전용 메소드
    protected String fetchJsonFromUrl(String url) {
        return youtubeWebClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String fetchActiveLiveChatId(String videoId) {
        try {
            String url = String.format("/videos?part=liveStreamingDetails&id=%s&key=%s", videoId, apiKey);
            String videoJson = fetchJsonFromUrl(url);
            return objectMapper.readTree(videoJson)
                    .path("items").get(0)
                    .path("liveStreamingDetails")
                    .path("activeLiveChatId")
                    .asText();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Chat> fetchLiveChatMessages(String liveChatId, String videoId) {
        List<Chat> chats = new ArrayList<>();
        try {
            String url = String.format("/liveChat/messages?liveChatId=%s&part=snippet,authorDetails&key=%s",
                    liveChatId, apiKey);
            String json = fetchJsonFromUrl(url);

            objectMapper.readTree(json).path("items").forEach(item -> {
                Chat chat = new Chat();
                chat.setVideoId(videoId);
                chat.setAuthor(item.path("authorDetails").path("displayName").asText());
                chat.setText(item.path("snippet").path("displayMessage").asText());
                chat.setPublishedAt(item.path("snippet").path("publishedAt").asText());
                chats.add(chat);
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
        return chats;
    }

    public void collectLiveChat(String videoId, int durationSeconds) {
        String liveChatId = fetchActiveLiveChatId(videoId);
        if (liveChatId == null || liveChatId.isEmpty()) return;

        long endTime = System.currentTimeMillis() + durationSeconds * 1000L;
        while (System.currentTimeMillis() < endTime) {
            fetchLiveChatMessages(liveChatId, videoId).forEach(chatRepository::save);
            try { Thread.sleep(5000); } catch (InterruptedException ignored) {}
        }
    }
}
