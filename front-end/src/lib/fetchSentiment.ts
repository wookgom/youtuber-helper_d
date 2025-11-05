export interface SentimentPoint {
  time: string;
  positive: number;
  neutral: number;
  negative: number;
}

export async function fetchSentimentData(channelId: string): Promise<{
  summary: { positive: number; neutral: number; negative: number };
  timeline: SentimentPoint[];
}> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const mockMode = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

  if (mockMode) {
    console.log("Mock Mode: 가짜 감정 데이터 생성 중...");

    const timeline: SentimentPoint[] = Array.from({ length: 10 }, (_, i) => ({
      time: `00:${String(i).padStart(2, "0")}`,
      positive: Math.floor(Math.random() * 50) + 25,
      neutral: Math.floor(Math.random() * 30) + 20,
      negative: Math.floor(Math.random() * 40) + 10,
    }));

    const total = timeline.length;
    const summary = {
      positive: Math.round(timeline.reduce((a, b) => a + b.positive, 0) / total),
      neutral: Math.round(timeline.reduce((a, b) => a + b.neutral, 0) / total),
      negative: Math.round(timeline.reduce((a, b) => a + b.negative, 0) / total),
    };

    await new Promise((res) => setTimeout(res, 1000));

    return { summary, timeline };
  }

  if (!backendUrl) throw new Error("환경변수 NEXT_PUBLIC_BACKEND_URL이 설정되지 않았습니다.");

  console.log("🌐 Real API Mode: 백엔드에서 감정 데이터 가져오는 중...");

  const res = await fetch(`${backendUrl}/sentiment?channelId=${channelId}`, {
    method: "GET",
  });

  if (!res.ok) throw new Error("백엔드 API 요청 실패");
  const data = await res.json();

  const timeline = data.map((item: any) => ({
    time: item.time ?? item.timestamp ?? "",
    positive: item.positive ?? item.pos ?? 0,
    neutral: item.neutral ?? item.mid ?? item.normal ?? 0,
    negative: item.negative ?? item.neg ?? 0,
  }));

  const total = timeline.length;
  const summary = total
    ? {
        positive: Math.round(timeline.reduce((a, b) => a + b.positive, 0) / total),
        neutral: Math.round(timeline.reduce((a, b) => a + b.neutral, 0) / total),
        negative: Math.round(timeline.reduce((a, b) => a + b.negative, 0) / total),
      }
    : { positive: 0, neutral: 0, negative: 0 };

  return { summary, timeline };
}