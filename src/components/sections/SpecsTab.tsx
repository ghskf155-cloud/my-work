"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 탭 카테고리 정의
const TABS = ["유틸리티", "자율성", "음성", "이동성", "디자인", "AI", "하드웨어"] as const;
type TabType = typeof TABS[number];

// 스펙 데이터 정의
const SPECS_DATA: Record<TabType, { label: string; value: string }[]> = {
  하드웨어: [
    { label: "키", value: "167 cm" },
    { label: "무게", value: "30 kg" },
    { label: "리프팅 능력", value: "70 kg" },
    { label: "운반 능력", value: "25 kg" },
  ],
  유틸리티: [
    { label: "자유도(자세 제어)", value: "양손 (22x2), 양팔 (7x2), 목 (3), 척추 (2), 양다리 (6x2)" },
  ],
  AI: [
    { label: "컴퓨팅", value: "1X HUMANICS Cortex / Nvidia Jetson Thor" },
    { label: "AI 연산 능력", value: "최대 2070 FP4 TFLOPS" },
  ],
  디자인: [
    { label: "바디 구조", value: "맞춤형 격자 폴리머가 적용된 부드러운 바디" },
    { label: "방수/방진", value: "손 IP68, 몸체 IP44" },
    { label: "구동 방식", value: "텐던(힘줄) 구동 방식" },
  ],
  자율성: [
    { label: "내비게이션", value: "고급 공간 인식 기술" },
  ],
  음성: [
    { label: "음성 인터페이스", value: "자연어 처리 (NLP)" },
  ],
  이동성: [
    { label: "이동 방식", value: "이족 보행" },
  ],
};

export default function SpecsTab() {
  const [activeTab, setActiveTab] = useState<TabType>("하드웨어");

  return (
    <section className="min-h-screen bg-stone-50 text-stone-900 py-24 px-6 md:px-12 font-sans" id="specs">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-16">
          상세 스펙
        </h2>

        {/* 탭 네비게이션 */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-12 border-b border-stone-200 pb-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm md:text-base transition-all duration-300 ${
                activeTab === tab
                  ? "bg-stone-900 text-stone-50 font-semibold shadow-md"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 동적 데이터 그리드 */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {SPECS_DATA[activeTab]?.map((spec, index) => (
                <div 
                  key={index} 
                  className="p-6 border border-stone-200 rounded-2xl bg-white shadow-sm hover:border-stone-400 transition-colors duration-300"
                >
                  <p className="text-stone-500 text-sm mb-2 uppercase tracking-wider">
                    {spec.label}
                  </p>
                  <p className="text-xl md:text-2xl font-medium">
                    {spec.value}
                  </p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
