"use client";

import { useEffect, useState } from "react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

interface BoardItem {
  id: string;
  name: string;
  type: "reservation" | "inquiry";
  content: string;
  createdAt: any;
}

export default function FirebaseBoard() {
  const [items, setItems] = useState<BoardItem[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState<"reservation" | "inquiry">("reservation");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<"all" | "reservation" | "inquiry">("all");

  useEffect(() => {
    if (isFirebaseConfigured && db) {
      // Real-time Firestore query
      const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data: BoardItem[] = [];
        snapshot.forEach((doc) => {
          const docData = doc.data();
          data.push({
            id: doc.id,
            name: docData.name,
            type: docData.type,
            content: docData.content,
            createdAt: docData.createdAt?.toDate() || new Date(),
          });
        });
        setItems(data);
      }, (error) => {
        console.error("Firestore onSnapshot error:", error);
      });

      return () => unsubscribe();
    } else {
      // LocalStorage Fallback for simulation
      const loadMockData = () => {
        const localData = localStorage.getItem("humanics_mock_board");
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            setItems(parsed.map((item: any) => ({
              ...item,
              createdAt: new Date(item.createdAt),
            })));
          } catch (e) {
            console.error(e);
          }
        } else {
          // Default mock values
          const defaultMock: BoardItem[] = [
            {
              id: "mock-1",
              name: "김민재",
              type: "reservation",
              content: "가정 내 자율 주행 및 장애물 회피 능력이 궁금합니다. 예약 신청합니다!",
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            },
            {
              id: "mock-2",
              name: "이소연",
              type: "inquiry",
              content: "니트 슈트의 오염 방지 처리가 세탁 가능한 재질인지 문의 드립니다.",
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
            },
          ];
          localStorage.setItem("humanics_mock_board", JSON.stringify(defaultMock));
          setItems(defaultMock);
        }
      };

      loadMockData();

      // Listen for local changes to simulate real-time across tabs/components
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "humanics_mock_board") {
          loadMockData();
        }
      };
      window.addEventListener("storage", handleStorageChange);
      
      // Custom event for same-tab updates
      const handleCustomSync = () => loadMockData();
      window.addEventListener("mock-board-update", handleCustomSync);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("mock-board-update", handleCustomSync);
      };
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setIsSubmitting(true);

    const newItem = {
      name: name.trim(),
      type,
      content: content.trim(),
      createdAt: isFirebaseConfigured ? Timestamp.now() : new Date().toISOString(),
    };

    try {
      if (isFirebaseConfigured && db) {
        await addDoc(collection(db, "inquiries"), newItem);
      } else {
        // Mock save
        const localData = localStorage.getItem("humanics_mock_board");
        const currentItems = localData ? JSON.parse(localData) : [];
        const mockItemWithId: BoardItem = {
          id: `mock-${Date.now()}`,
          name: name.trim(),
          type,
          content: content.trim(),
          createdAt: new Date(),
        };
        const updated = [mockItemWithId, ...currentItems];
        localStorage.setItem("humanics_mock_board", JSON.stringify(updated));
        window.dispatchEvent(new Event("mock-board-update"));
      }

      setName("");
      setContent("");
    } catch (error) {
      console.error("Error submitting entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <section id="board" className="min-h-screen bg-stone-50 text-stone-900 py-24 px-6 md:px-12 border-t border-stone-200 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* 왼쪽: 설명 및 입력 폼 */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <span className="text-stone-500 font-bold uppercase tracking-wider text-sm mb-4">Live Feedback & Booking</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
            실시간 사전 예약 및 문의
          </h2>
          <p className="text-lg text-stone-600 mb-10 leading-relaxed break-keep">
            HUMANICS 가정용 로봇에 관심이 있으시거나 궁금한 점이 있으신가요? 실시간 예약 문의 게시판을 통해 언제든 질문이나 예약을 남겨주세요. 
            {!isFirebaseConfigured && (
              <span className="block mt-4 text-sm text-stone-400 font-medium">
                💡 현재 데모(Mock) 모드로 작동 중입니다. Firebase 설정 환경변수 입력 시 실시간 클라우드 DB와 자동 연동됩니다.
              </span>
            )}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-stone-200 p-8 rounded-3xl shadow-sm">
            <div>
              <label htmlFor="board-name" className="block text-sm font-semibold text-stone-700 mb-2">작성자 이름</label>
              <input
                id="board-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">구분</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setType("reservation")}
                  className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                    type === "reservation"
                      ? "bg-stone-900 text-stone-50 border-stone-900 shadow-sm"
                      : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  사전 예약 신청
                </button>
                <button
                  type="button"
                  onClick={() => setType("inquiry")}
                  className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                    type === "inquiry"
                      ? "bg-stone-900 text-stone-50 border-stone-900 shadow-sm"
                      : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  일반 제품 문의
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="board-content" className="block text-sm font-semibold text-stone-700 mb-2">내용</label>
              <textarea
                id="board-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="예약 사유 혹은 궁금한 내용을 입력하세요"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-stone-900 text-stone-50 py-4 rounded-xl font-bold hover:bg-stone-800 disabled:bg-stone-300 transition-colors shadow-md"
            >
              {isSubmitting ? "등록 중..." : type === "reservation" ? "사전 예약 등록" : "문의 등록하기"}
            </button>
          </form>
        </div>

        {/* 오른쪽: 실시간 목록 조회 */}
        <div className="lg:col-span-7 flex flex-col h-[650px]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex space-x-2 bg-stone-200/50 p-1.5 rounded-full">
              {(["all", "reservation", "inquiry"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
                    filter === t
                      ? "bg-white text-stone-900 shadow-sm"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  {t === "all" ? "전체" : t === "reservation" ? "예약" : "문의"}
                </button>
              ))}
            </div>
            <span className="text-sm font-semibold text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
              실시간 현황: <strong className="text-stone-900">{filteredItems.length}</strong>건
            </span>
          </div>

          {/* 목록 영역 */}
          <div className="flex-1 overflow-y-auto no-scrollbar pr-2 space-y-4 max-h-[580px] border border-stone-200/60 rounded-3xl p-6 bg-white shadow-inner">
            <AnimatePresence initial={false}>
              {filteredItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center text-stone-400 py-12"
                >
                  <svg className="w-12 h-12 mb-3 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="font-medium">등록된 실시간 내역이 없습니다.</p>
                  <p className="text-xs mt-1">첫 번째 의견 혹은 예약을 남겨보세요!</p>
                </motion.div>
              ) : (
                filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layoutId={item.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="p-6 border border-stone-150 rounded-2xl bg-stone-50 hover:bg-stone-100/50 hover:border-stone-300 transition-colors relative"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-stone-850 text-base">{item.name}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                          item.type === "reservation"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}>
                          {item.type === "reservation" ? "사전 예약" : "제품 문의"}
                        </span>
                      </div>
                      <span className="text-xs text-stone-400">
                        {item.createdAt.toLocaleTimeString("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-stone-600 text-sm md:text-base leading-relaxed break-all break-keep">
                      {item.content}
                    </p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
