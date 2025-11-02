"use client";

import { useState } from "react";
import SentimentChart from "@/components/SentimentChart";
import SentimentTimeline from "@/components/SentimentTimeline";

type Summary = { positive: number; neutral: number; negative: number };
type TimelineItem = { time: string; positive: number; neutral: number; negative: number };

export default function HomePage() {
  const [channelId, setChannelId] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!channelId.trim()) return alert("채널 ID를 입력해주세요.");
    setLoading(true);

    try {
      const res = await fetch(`/api/sentiment?channelId=${encodeURIComponent(channelId)}`);
      if (!res.ok) throw new Error("API 오류");
      const json = await res.json();
      setSummary(json.summary);
      setTimeline(json.timeline);
    } catch (e) {
      console.error(e);
      alert("데이터를 불러오는 중 오류가 발생했습니다. 콘솔을 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">채널 분석</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            placeholder="유튜브 채널 ID 또는 채널 URL을 입력하세요"
            className="border rounded-lg px-4 py-2 flex-1"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "분석 중..." : "분석하기"}
          </button>
        </div>
      </div>

      {summary ? (
        <div className="grid md:grid-cols-2 gap-6">
          <SentimentChart data={summary} />
          <SentimentTimeline timeline={timeline} />
        </div>
      ) : (
        <div className="text-center text-gray-500">채널을 입력하고 분석을 실행하면 결과가 표시됩니다.</div>
      )}
    </div>
  );
}
