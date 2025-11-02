import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const channelId = url.searchParams.get("channelId") ?? "unknown";

  console.log("요청 채널 ID:", channelId);

  // 요약(원형용)
  const summary = {
    positive: Math.floor(Math.random() * 50) + 30,
    neutral: Math.floor(Math.random() * 30) + 10,
    negative: Math.floor(Math.random() * 30) + 10
  };

  // 시간대별(시계열) - 10포인트 생성 (예: 5분 단위)
  const timeline = Array.from({ length: 10 }).map((_, i) => ({
    time: `${String(i * 5).padStart(2, "0")}:00`,
    positive: Math.floor(Math.random() * 20) + 5,
    neutral: Math.floor(Math.random() * 10) + 3,
    negative: Math.floor(Math.random() * 15) + 2
  }));

  return NextResponse.json({ summary, timeline });
}
