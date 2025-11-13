"use client"; // useState 등 client side 기능 사용

import { useState } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900 flex h-screen overflow-hidden">
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">메뉴</h2>
            <ul className="space-y-4">
              <li className="hover:text-blue-500 cursor-pointer">홈</li>
              <li className="hover:text-blue-500 cursor-pointer">채팅 분석</li>
              <li className="hover:text-blue-500 cursor-pointer">하이라이트</li>
              <li className="hover:text-blue-500 cursor-pointer">설정</li>
            </ul>
          </div>
        </aside>

        <div className="flex-1 flex flex-col overflow-auto">
          <nav className="w-full p-4 shadow-md bg-white flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button
                className="p-2 rounded-md hover:bg-gray-200 transition"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-bold">YOUTUBE-HELPER</h1>
            </div>
            {/* <div className="hidden md:flex gap-4">
              <button className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition">
                로그인
              </button>
            </div> */}
          </nav>

          <main className="max-w-5xl mx-auto p-6">{children}</main>
        </div>

        {/* 
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )} */}
      </body>
    </html>
  );
}
