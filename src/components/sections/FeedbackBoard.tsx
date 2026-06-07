"use client";

import React, { useState, useEffect } from "react";
import { db, collection, addDoc, onSnapshot } from "@/lib/firebase";

interface FeedbackItem {
  id: string;
  name: string;
  content: string;
  createdAt: {
    toDate: () => Date;
  };
}

export default function FeedbackBoard() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to real-time feedback updates
  useEffect(() => {
    const feedbackCollection = collection(db, "feedbacks");
    
    // Listen for real-time updates
    const unsubscribe = onSnapshot(feedbackCollection, (snapshot: any) => {
      const list: FeedbackItem[] = [];
      snapshot.forEach((doc: any) => {
        list.push({
          id: doc.id,
          ...doc.data(),
        } as FeedbackItem);
      });
      
      setFeedbacks(list);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) return setErrorMsg("작성자 이름을 입력해 주세요.");
    if (!content.trim()) return setErrorMsg("내용을 입력해 주세요.");
    if (content.length > 300) return setErrorMsg("내용은 300자 이내로 작성해 주세요.");

    setIsSubmitting(true);

    try {
      const feedbackCollection = collection(db, "feedbacks");
      await addDoc(feedbackCollection, {
        name: name.trim(),
        content: content.trim(),
        createdAt: new Date()
      });

      // Clear input
      setName("");
      setContent("");
    } catch (error) {
      console.error("Error writing document: ", error);
      setErrorMsg("등록에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date nicely
  const formatDate = (dateObj: any) => {
    if (!dateObj) return "";
    try {
      const date = dateObj.toDate();
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    } catch (e) {
      return "";
    }
  };

  return (
    <section id="feedback-board" className="bg-stone-50 text-stone-900 py-24 px-6 md:px-12 border-t border-stone-200">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">실시간 기대평 & 문의</h2>
          <p className="text-stone-500 text-lg">
            HUMANICS에 대한 궁금한 점이나 기대평을 남겨주시면 실시간으로 답변해 드립니다.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-stone-200 p-6 md:p-8 rounded-3xl shadow-sm mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-5">
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">작성자</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름/닉네임"
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-stone-900 focus:bg-white focus:outline-none transition-colors text-stone-900 text-sm"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">내용 (300자 내)</label>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="HUMANICS에 바라는 점이나 질문을 남겨주세요."
                maxLength={300}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-stone-900 focus:bg-white focus:outline-none transition-colors text-stone-900 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {errorMsg ? (
              <p className="text-red-500 text-xs font-medium">{errorMsg}</p>
            ) : (
              <p className="text-stone-400 text-xs">작성하신 글은 데이터베이스에 안전하게 기록되어 실시간으로 공유됩니다.</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-stone-900 text-stone-50 px-6 py-3 rounded-full text-sm font-bold hover:bg-stone-800 disabled:bg-stone-300 transition-colors shadow-md flex items-center shrink-0"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-4 w-4 text-stone-50 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : null}
              등록하기
            </button>
          </div>
        </form>

        {/* Live List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-stone-500 flex items-center gap-2 mb-6">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
            실시간 등록 현황 ({feedbacks.length}건)
          </h3>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <svg className="animate-spin h-8 w-8 text-stone-300" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-12 text-stone-400 border border-dashed border-stone-200 rounded-3xl bg-white">
              첫 번째 기대평이나 질문을 작성해 주세요!
            </div>
          ) : (
            <div className="divide-y divide-stone-200 border border-stone-200 rounded-3xl bg-white overflow-hidden shadow-sm">
              {feedbacks.map((item) => (
                <div key={item.id} className="p-6 hover:bg-stone-50/50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-stone-900">{item.name}</span>
                    <span className="text-xs text-stone-400 font-mono">{formatDate(item.createdAt)}</span>
                  </div>
                  <p className="text-stone-600 text-sm md:text-base whitespace-pre-line leading-relaxed">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
