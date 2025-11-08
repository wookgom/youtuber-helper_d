package com.example.DEVs.contoller;

import com.example.DEVs.controller.ChatController;
import com.example.DEVs.entity.Sentiment;
import com.example.DEVs.repository.SentimentRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ChatController.class) // ← 컨트롤러 클래스명으로 변경
@AutoConfigureMockMvc
class SentimentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private YouTubeLiveChatScraper scraper; // live chat collector

    @MockitoBean
    private PyAnalService pyAnalService;

    @MockitoBean
    private SentimentRepository sentimentRepository;

    @MockitoBean
    private YouTubeHtmlParser parser; // 만약 DI되어 있다면

    @Test
    void testCollectLiveSentiment() throws Exception {

        String videoId = "VLKSUBxj0to";

        // ✅ 더미 Sentiment mock 객체
        Sentiment dummy = new Sentiment();
        dummy.setVideoId(videoId);
        dummy.setTimeline("03:25:23");
        dummy.setPositive(33.33);
        dummy.setNegative(3.33);
        dummy.setNeutral(63.33);

        // ✅ Mock 동작 정의
        Mockito.when(scraper.collectLiveChat(eq(videoId), any(Integer.class)))
                .thenReturn(Instant.now());

        Mockito.when(pyAnalService.runSentimentAnalyzer(eq(videoId), any(Long.class)))
                .thenReturn(dummy);

        Mockito.when(sentimentRepository.findByVideoId(videoId))
                .thenReturn(List.of(dummy));

        // ✅ API 호출 및 검증
        mockMvc.perform(post("/live/sentiment/start")
                        .param("videoId", videoId)
                        .param("durationSeconds", "60")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.videoId").value(videoId))
                .andExpect(jsonPath("$.positive").value(33.33))
                .andExpect(jsonPath("$.negative").value(3.33))
                .andExpect(jsonPath("$.neutral").value(63.33));
    }
}
