"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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
    { label: "니트 슈트", value: "프리미엄 패브릭 코팅 커버" },
    { label: "부드러운 바디", value: "유연한 격자 폴리머 스킨" },
    { label: "텐던 구동", value: "고장력 와이어 풀리 시스템" },
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
              className={
                activeTab === "유틸리티" || activeTab === "음성" || activeTab === "이동성" || activeTab === "AI"
                  ? "grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
                  : activeTab === "자율성" || activeTab === "디자인"
                  ? "grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
                  : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              }
            >
              {activeTab === "유틸리티" ? (
                <>
                  <div className="p-8 md:p-12 border border-stone-200 rounded-3xl bg-white shadow-sm hover:border-stone-400 transition-colors duration-300 flex flex-col justify-center min-h-[300px]">
                    <p className="text-stone-500 text-sm mb-4 uppercase tracking-wider font-semibold">
                      {SPECS_DATA["유틸리티"][0].label}
                    </p>
                    <p className="text-2xl md:text-3xl font-medium leading-relaxed break-keep">
                      {SPECS_DATA["유틸리티"][0].value}
                    </p>
                    <p className="text-stone-400 mt-6 text-base leading-relaxed break-keep">
                      * HUMANICS는 양손에 각각 22개의 자유도(Degree of Freedom)를 갖춘 초정밀 액추에이터 손을 탑재하여, 사람처럼 미세하고 복잡한 조작(머리 빗기, 도구 사용 등)을 완벽하게 수행할 수 있습니다.
                    </p>
                  </div>
                  <div className="border border-stone-200 rounded-3xl overflow-hidden shadow-sm h-[300px] md:h-auto min-h-[300px] relative bg-white flex items-center justify-center p-6 hover:border-stone-400 transition-colors duration-300">
                    <Image
                      src="/robot_hand.png"
                      alt="HUMANICS 22 DoF Hand"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain rounded-2xl p-6"
                    />
                  </div>
                </>
              ) : activeTab === "음성" ? (
                <>
                  <div className="p-8 md:p-12 border border-stone-200 rounded-3xl bg-white shadow-sm hover:border-stone-400 transition-colors duration-300 flex flex-col justify-center min-h-[300px]">
                    <p className="text-stone-500 text-sm mb-4 uppercase tracking-wider font-semibold">
                      {SPECS_DATA["음성"][0].label}
                    </p>
                    <p className="text-2xl md:text-3xl font-medium leading-relaxed break-keep">
                      {SPECS_DATA["음성"][0].value}
                    </p>
                    <p className="text-stone-400 mt-6 text-base leading-relaxed break-keep">
                      * 고감도 멀티 어레이 마이크 모듈과 분해 구조 형태의 최고급 하이파이(Hi-Fi) 스피커 유닛을 내장하여, 소음이 심한 환경에서도 사용자의 명령을 놓치지 않고 수음하며 또렷하고 자연스러운 합성 음성 피드백을 전달합니다.
                    </p>
                  </div>
                  <div className="border border-stone-200 rounded-3xl overflow-hidden shadow-sm h-[300px] md:h-auto min-h-[300px] relative bg-white flex items-center justify-center p-6 hover:border-stone-400 transition-colors duration-300">
                    <Image
                      src="/robot_ear.png"
                      alt="HUMANICS Acoustic Module"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain rounded-2xl p-6"
                    />
                  </div>
                </>
              ) : activeTab === "이동성" ? (
                <>
                  <div className="p-8 md:p-12 border border-stone-200 rounded-3xl bg-white shadow-sm hover:border-stone-400 transition-colors duration-300 flex flex-col justify-center min-h-[300px]">
                    <p className="text-stone-500 text-sm mb-4 uppercase tracking-wider font-semibold">
                      {SPECS_DATA["이동성"][0].label}
                    </p>
                    <p className="text-2xl md:text-3xl font-medium leading-relaxed break-keep">
                      {SPECS_DATA["이동성"][0].value}
                    </p>
                    <p className="text-stone-400 mt-6 text-base leading-relaxed break-keep">
                      * 고성능 하이-토크 회전식 및 전기식 액추에이터 메커니즘을 기반으로 한 고차원 보행 알고리즘을 사용합니다. 무거운 화물을 양손에 들고 계단이나 단차가 있는 가정 내 거실을 자연스럽고 견고하게 이족 보행할 수 있습니다.
                    </p>
                  </div>
                  <div className="border border-stone-200 rounded-3xl overflow-hidden shadow-sm h-[300px] md:h-auto min-h-[300px] relative bg-white flex items-center justify-center p-6 hover:border-stone-400 transition-colors duration-300">
                    <Image
                      src="/robot_walk.png"
                      alt="HUMANICS Bipedal Walking"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain rounded-2xl p-6"
                    />
                  </div>
                </>
              ) : activeTab === "디자인" ? (
                <>
                  {/* 니트 슈트 */}
                  <div className="flex flex-col justify-between p-6 border border-stone-200 rounded-3xl bg-white shadow-sm hover:border-stone-400 transition-colors duration-300 min-h-[360px]">
                    <div>
                      <p className="text-stone-500 text-sm mb-2 uppercase tracking-wider font-semibold">
                        {SPECS_DATA["디자인"][0].label}
                      </p>
                      <p className="text-xl md:text-2xl font-medium leading-normal break-keep">
                        {SPECS_DATA["디자인"][0].value}
                      </p>
                      <p className="text-stone-400 mt-4 text-sm leading-relaxed break-keep">
                        몸체 전체를 빈틈없이 완벽하게 감싸 보호하는 프리미엄 패브릭 소재의 하이브리드 보호 쉘입니다.
                      </p>
                    </div>
                    <div className="border border-stone-100 rounded-2xl overflow-hidden shadow-sm h-[180px] relative bg-stone-50 flex items-center justify-center mt-4">
                      <Image
                        src="/design_knitsuit.png"
                        alt="Knit Suit Closeup"
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover rounded-2xl"
                      />
                    </div>
                  </div>

                  {/* 부드러운 바디 */}
                  <div className="flex flex-col justify-between p-6 border border-stone-200 rounded-3xl bg-white shadow-sm hover:border-stone-400 transition-colors duration-300 min-h-[360px]">
                    <div>
                      <p className="text-stone-500 text-sm mb-2 uppercase tracking-wider font-semibold">
                        {SPECS_DATA["디자인"][1].label}
                      </p>
                      <p className="text-xl md:text-2xl font-medium leading-normal break-keep">
                        {SPECS_DATA["디자인"][1].value}
                      </p>
                      <p className="text-stone-400 mt-4 text-sm leading-relaxed break-keep">
                        격자형 충격 흡수 폴리머가 장착되어 사람과 접촉 시 충격을 분산하고 안전하게 교감합니다.
                      </p>
                    </div>
                    <div className="border border-stone-100 rounded-2xl overflow-hidden shadow-sm h-[180px] relative bg-stone-50 flex items-center justify-center mt-4">
                      <Image
                        src="/design_softbody.png"
                        alt="Soft Body Closeup"
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover rounded-2xl"
                      />
                    </div>
                  </div>

                  {/* 텐던 구동 */}
                  <div className="flex flex-col justify-between p-6 border border-stone-200 rounded-3xl bg-white shadow-sm hover:border-stone-400 transition-colors duration-300 min-h-[360px]">
                    <div>
                      <p className="text-stone-500 text-sm mb-2 uppercase tracking-wider font-semibold">
                        {SPECS_DATA["디자인"][2].label}
                      </p>
                      <p className="text-xl md:text-2xl font-medium leading-normal break-keep">
                        {SPECS_DATA["디자인"][2].value}
                      </p>
                      <p className="text-stone-400 mt-4 text-sm leading-relaxed break-keep">
                        기계식 관절 대신 와이어와 도르래를 활용해 인체의 근육 및 힘줄 구조를 사실적으로 모사합니다.
                      </p>
                    </div>
                    <div className="border border-stone-100 rounded-2xl overflow-hidden shadow-sm h-[180px] relative bg-stone-50 flex items-center justify-center mt-4">
                      <Image
                        src="/design_tendon.png"
                        alt="Tendon Driven closeup"
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover rounded-2xl"
                      />
                    </div>
                  </div>
                </>
              ) : activeTab === "AI" ? (
                <>
                  <div className="p-8 md:p-12 border border-stone-200 rounded-3xl bg-white shadow-sm hover:border-stone-400 transition-colors duration-300 flex flex-col justify-center min-h-[300px]">
                    <div className="space-y-6">
                      <div>
                        <p className="text-stone-500 text-sm mb-2 uppercase tracking-wider font-semibold">
                          {SPECS_DATA["AI"][0].label}
                        </p>
                        <p className="text-2xl md:text-3xl font-medium leading-relaxed break-keep">
                          {SPECS_DATA["AI"][0].value}
                        </p>
                      </div>
                      <div className="border-t border-stone-100 pt-6">
                        <p className="text-stone-500 text-sm mb-2 uppercase tracking-wider font-semibold">
                          {SPECS_DATA["AI"][1].label}
                        </p>
                        <p className="text-2xl md:text-3xl font-medium leading-relaxed break-keep">
                          {SPECS_DATA["AI"][1].value}
                        </p>
                      </div>
                    </div>
                    <p className="text-stone-400 mt-8 text-base leading-relaxed break-keep">
                      * 자체 개발한 고성능 인공지능 프로세서인 HUMANICS Cortex 칩셋과 Nvidia Jetson Thor 모듈을 결합하여, 온디바이스(On-device)에서 실시간으로 대규모 멀티모달 AI 연산 및 공간 위상 분석을 안전하고 빠르게 처리합니다.
                    </p>
                  </div>
                  <div className="border border-stone-200 rounded-3xl overflow-hidden shadow-sm h-[300px] md:h-auto min-h-[300px] relative bg-white flex items-center justify-center p-6 hover:border-stone-400 transition-colors duration-300">
                    <Image
                      src="/robot_cortex.png"
                      alt="HUMANICS Cortex Board"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain rounded-2xl p-6"
                    />
                  </div>
                </>
              ) : activeTab === "자율성" ? (
                <>
                  <div className="p-8 md:p-12 border border-stone-200 rounded-3xl bg-white shadow-sm hover:border-stone-400 transition-colors duration-300 flex flex-col justify-center min-h-[300px]">
                    <p className="text-stone-500 text-sm mb-4 uppercase tracking-wider font-semibold">
                      {SPECS_DATA["자율성"][0].label}
                    </p>
                    <p className="text-2xl md:text-3xl font-medium leading-relaxed break-keep">
                      {SPECS_DATA["자율성"][0].value}
                    </p>
                    <p className="text-stone-400 mt-6 text-base leading-relaxed break-keep">
                      * 3D LiDAR 포인트 클라우드 실시간 매핑 기술과 복잡한 가정 내 구조물(계단, 가구) 및 동적인 장애물(사람, 반려동물)을 인지하는 고차원 비전 알고리즘을 결합하여, 최고 수준의 자율 보행 안전성을 보장합니다.
                    </p>
                  </div>
                  <div className="border border-stone-200 rounded-3xl overflow-hidden shadow-sm h-[300px] md:h-auto min-h-[300px] relative bg-white flex items-center justify-center p-6 hover:border-stone-400 transition-colors duration-300">
                    <Image
                      src="/spatial_pointcloud.png"
                      alt="Spatial Mapping Point Cloud"
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-contain rounded-2xl p-6"
                    />
                  </div>
                  <div className="border border-stone-200 rounded-3xl overflow-hidden shadow-sm h-[300px] md:h-auto min-h-[300px] relative bg-white flex items-center justify-center p-6 hover:border-stone-400 transition-colors duration-300">
                    <Image
                      src="/spatial_real.png"
                      alt="Robot Navigating Home"
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-contain rounded-2xl p-6"
                    />
                  </div>
                </>
              ) : (
                SPECS_DATA[activeTab]?.map((spec, index) => (
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
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
