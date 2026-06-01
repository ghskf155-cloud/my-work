"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchInquiries, createInquiry, Inquiry } from "@/lib/firebaseStore";

export default function QnaPage() {
  const [questions, setQuestions] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCloud, setIsCloud] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newAuthor, setNewAuthor] = useState("");

  // 목록 새로고침/로딩 함수
  const loadData = async () => {
    setLoading(true);
    const result = await fetchInquiries();
    setQuestions(result.data);
    setIsCloud(result.isCloud);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const authorName = newAuthor.trim() || "익명사용자";
    
    // Firebase 또는 로컬스토리지에 저장
    const result = await createInquiry(newTitle, newContent, authorName);
    
    setNewTitle("");
    setNewContent("");
    setNewAuthor("");
    
    // 데이터 새로고침
    await loadData();
    
    if (result.isCloud) {
      alert("☁️ Firebase 클라우드 서버에 실시간 예약 문의가 정상 등록되었습니다!");
    } else {
      alert("💾 로컬 백업 저장소에 예약 문의가 임시 저장되었습니다.\n(환경변수에 Firebase 프로젝트 ID가 채워지면 클라우드로 전송됩니다.)");
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 py-24 px-6 md:px-12 text-stone-900 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 flex justify-between items-center">
          <Link href="/#faq" className="inline-flex items-center text-stone-500 hover:text-stone-900 transition-colors font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            홈으로 돌아가기
          </Link>

          {/* 실시간 연결 상태 표시기 */}
          <div className="flex items-center space-x-2 bg-white px-4 py-1.5 rounded-full border border-stone-200 shadow-sm text-sm">
            <span className={`w-2.5 h-2.5 rounded-full ${isCloud ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`}></span>
            <span className="text-stone-600 font-medium">
              {isCloud ? "Firebase Cloud 연동됨" : "로컬 보안 저장소 작동중"}
            </span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">예약 및 구매 문의 게시판</h1>
        <p className="text-stone-600 mb-12 text-lg">
          HUMANICS 가정용 로봇 구매 예약 및 기술 사양에 대한 문의를 실시간으로 접수받습니다.
        </p>

        {/* 질문 작성 폼 */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 mb-16">
          <h2 className="text-2xl font-semibold mb-6 tracking-tight">예약 및 문의 작성</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-stone-700 mb-2">작성자 / 예약자명</label>
                <input
                  type="text"
                  id="author"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all"
                  placeholder="성함 혹은 닉네임 (기본값: 익명)"
                />
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-2">문의 제목</label>
                <input
                  type="text"
                  id="title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all"
                  placeholder="예약 또는 문의 제목을 입력하세요"
                />
              </div>
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-stone-700 mb-2">문의 사항 및 요구 조건</label>
              <textarea
                id="content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all resize-none"
                placeholder="예약 수량, 희망 배송 옵션 혹은 구체적인 사용 목적을 상세히 적어주시면 빠르게 메일 또는 연락처로 피드백 드리겠습니다."
              ></textarea>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-8 py-3 bg-stone-900 text-stone-50 rounded-full hover:bg-stone-800 transition-transform transform hover:scale-105 active:scale-95 duration-200 font-medium shadow-md"
              >
                예약 문의 신청하기
              </button>
            </div>
          </form>
        </div>

        {/* 질문 목록 */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">문의 및 예약 현황</h2>
            <button 
              onClick={loadData} 
              className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M21 20v-5h-.581m0 0a8.003 8.003 0 01-15.357-2" />
              </svg>
              <span>새로고침</span>
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 text-stone-500 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-4 border-stone-300 border-t-stone-900 rounded-full animate-spin"></div>
              <span>데이터를 동기화하는 중입니다...</span>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden divide-y divide-stone-150">
              {questions.length === 0 ? (
                <div className="p-12 text-center text-stone-500">등록된 문의가 없습니다. 첫 예약 문의를 남겨보세요!</div>
              ) : (
                questions.map((q) => (
                  <div key={q.id} className="p-6 hover:bg-stone-50 transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-stone-900 group-hover:text-stone-700 transition-colors">{q.title}</h3>
                      <span className="text-sm text-stone-400 shrink-0 ml-4 font-medium">{q.date}</span>
                    </div>
                    <p className="text-stone-600 text-base mb-4 leading-relaxed break-all whitespace-pre-wrap">{q.content}</p>
                    <div className="text-sm text-stone-400 font-medium">
                      예약 문의자: <span className="text-stone-600">{q.author}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

