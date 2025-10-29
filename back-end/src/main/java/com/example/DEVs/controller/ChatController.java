package com.example.DEVs.controller;


import com.example.DEVs.entity.Chat;
import com.example.DEVs.repository.ChatRepository;
import com.example.DEVs.service.YouTubeLiveChatScraper;
import com.example.DEVs.service.YouTubeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/youtube")
public class ChatController {

    private final YouTubeLiveChatScraper scraper;
    private final ChatRepository chatRepository;

    @GetMapping("/chat")
    public ResponseEntity<List<Chat>> getLiveChat(@RequestParam String videoId) throws Exception {
        List<Chat> comments = scraper.fetchLiveChat(videoId, 5);
        chatRepository.saveAll(comments);
        return ResponseEntity.ok(comments);
    }

    private final YouTubeService youTubeService;

    /**
     * 특정 비디오 ID의 라이브 채팅을 수집하고 DB에 저장
     * youtube api 사용
     *
     * @param videoId        유튜브 비디오 ID
     * @param durationSeconds 수집 지속 시간 (초)
     * @return 성공 메시지
     */
    @PostMapping("/collect")
    public ResponseEntity<String> collectLiveChat(
            @RequestParam String videoId,
            @RequestParam(defaultValue = "60") int durationSeconds) {

        new Thread(() -> youTubeService.collectLiveChat(videoId, durationSeconds)).start();

        return ResponseEntity.ok("라이브 채팅 수집을 시작했습니다. (videoId: " + videoId + ")");
    }

}
