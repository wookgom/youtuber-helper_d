"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchSentimentData, SentimentPoint } from "@/lib/fetchSentiment";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const COLORS = ["#4ade80", "#facc15", "#f87171"];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={13}
      fontWeight="bold"
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [channel, setChannel] = useState("");
  const [sentimentData, setSentimentData] = useState<SentimentPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!channel) return;

    const load = async () => {
      try {
        setIsLoading(true);
        const { timeline } = await fetchSentimentData(channel);

        setSentimentData((prev) => {
          if (timeline.length > prev.length) {
            return timeline;
          }
          return prev;
        });

        setHasData(true);
      } catch (err) {
        console.error("데이터 갱신 오류:", err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
    intervalRef.current = setInterval(load, 60000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [channel]);

  const handleStart = () => {
    if (!inputValue.trim()) return;
    setChannel(inputValue.trim());
    setSentimentData([]);
    setHasData(false);
  };

  const handleStop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setChannel("");
  };

  const latest =
    sentimentData.length > 0 ? sentimentData[sentimentData.length - 1] : null;

  const chartData = latest
    ? [
        { name: "긍정", value: latest.positive },
        { name: "중립", value: latest.neutral },
        { name: "부정", value: latest.negative },
      ]
    : [];

  const Skeleton = () => (
    <motion.div
      key="skeleton"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full flex flex-col items-center justify-center gap-6 p-8"
    >
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-40 w-40 bg-gray-200 rounded-full" />
        <div className="h-6 w-48 bg-gray-200 rounded-lg" />
      </div>
      <div className="animate-pulse h-64 w-full bg-gray-200 rounded-lg" />
    </motion.div>
  );

  const SentimentCharts = () => (
    <motion.div
      key="charts"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full flex flex-col items-center gap-8"
    >
      <div className="flex flex-col items-center">
        <motion.div
          key={latest?.time}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ResponsiveContainer width={300} height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={renderCustomizedLabel}
                isAnimationActive={true}
                animationDuration={800}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
        {latest && (
          <p className="text-gray-700 font-semibold mt-2">{latest.time}</p>
        )}
      </div>

      <motion.div
        key={sentimentData.length}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full h-64"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sentimentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="time" stroke="#888" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="positive"
              stroke="#4ade80"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="neutral"
              stroke="#facc15"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="negative"
              stroke="#f87171"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {isLoading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-gray-400 text-sm"
        ></motion.p>
      )}
    </motion.div>
  );

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-10 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-0 w-full max-w-4xl"
      >
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold text-black mb-3"
          >
            실시간 감성 분석
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-600 text-lg"
          >
            1분마다 새 데이터가 갱신됩니다.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 mb-8 border border-white/20"
        >
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="채널 ID를 입력하세요"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 border-2 border-gray-200 rounded-xl p-4 text-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={!!channel}
            />
            {!channel ? (
              <button
                onClick={handleStart}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
              >
                분석 시작
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
              >
                분석 중단
              </button>
            )}
          </div>
          {channel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 flex items-center gap-2 text-sm text-gray-600"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              분석 중:{" "}
              <span className="font-semibold text-green-500">{channel}</span>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          key="chart-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20"
        >
          <AnimatePresence mode="wait">
            {!hasData ? <Skeleton /> : <SentimentCharts />}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
