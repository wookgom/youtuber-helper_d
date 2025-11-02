"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type TimelineItem = { time: string; positive: number; neutral: number; negative: number };

export default function SentimentTimeline({ timeline }: { timeline: TimelineItem[] }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-center">시간대별 감정 변화</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
            <Line type="monotone" dataKey="positive" name="긍정" stroke="#4ade80" strokeWidth={2} />
            <Line type="monotone" dataKey="neutral" name="보통" stroke="#facc15" strokeWidth={2} />
            <Line type="monotone" dataKey="negative" name="부정" stroke="#f87171" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
