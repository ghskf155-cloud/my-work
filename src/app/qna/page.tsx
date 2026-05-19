"use client";

import { useState } from "react";
import Link from "next/link";

export default function QnaPage() {
  const [questions, setQuestions] = useState([
    { id: 1, title: "배송은 언제쯤 시작되나요?", author: "구매희망자1", date: "2026-05-18" },
    { id: 2, title: "A/S 보증 기간과 절차가 어떻게 되나요?", author: "로봇사랑", date: "2026-05-17" },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const newQuestion = {
      id: questions.length + 1,
      title: newTitle,
      author: "익명사용자",
      date: new Date().toISOString().split("T")[0],
    };

    setQuestions([newQuestion, ...questions]);
    setNewTitle("");
    setNewContent("");
    alert("질문이 성공적으로 등록되었습니다.");
  };

  return (
    <main className="min-h-screen bg-stone-50 py-24 px-6 md:px-12 text-stone-900">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <Link href="/#faq" className="inline-flex items-center text-stone-500 hover:text-stone-900 transition-colors font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            홈으로 돌아가기
          </Link>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Q&A 게시판</h1>
        <p className="text-stone-600 mb-12 text-lg">
          HUMANICS에 대해 궁금한 점을 남겨주시면 빠르게 답변해 드립니다.
        </p>

        {/* 질문 작성 폼 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 mb-16">
          <h2 className="text-2xl font-semibold mb-6 tracking-tight">새 질문 작성</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-2">제목</label>
              <input
                type="text"
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all"
                placeholder="질문 제목을 입력하세요"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-stone-700 mb-2">내용</label>
              <textarea
                id="content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all resize-none"
                placeholder="질문 내용을 상세히 적어주세요"
              ></textarea>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-8 py-3 bg-stone-900 text-stone-50 rounded-full hover:bg-stone-800 transition-colors font-medium shadow-sm"
              >
                질문 등록하기
              </button>
            </div>
          </form>
        </div>

        {/* 질문 목록 */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 tracking-tight">질문 목록</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            {questions.length === 0 ? (
              <div className="p-8 text-center text-stone-500">등록된 질문이 없습니다.</div>
            ) : (
              questions.map((q) => (
                <div key={q.id} className="p-6 border-b border-stone-200 last:border-b-0 hover:bg-stone-50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium group-hover:text-stone-600 transition-colors">{q.title}</h3>
                    <span className="text-sm text-stone-400 shrink-0 ml-4 font-medium">{q.date}</span>
                  </div>
                  <div className="text-sm text-stone-500">
                    작성자: {q.author}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
