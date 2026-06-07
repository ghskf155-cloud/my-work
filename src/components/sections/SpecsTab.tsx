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
              className={
                activeTab === "유틸리티" || activeTab === "음성" || activeTab === "AI" || activeTab === "자율성"
                  ? "w-full" 
                  : activeTab === "디자인" 
                    ? "grid grid-cols-1 lg:grid-cols-2 gap-8" 
                    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              }
            >
              {activeTab === "유틸리티" ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 border border-stone-200 rounded-3xl shadow-sm">
                  {/* 설명 */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider bg-stone-100 px-3 py-1 rounded-full">
                        자유도 (Degrees of Freedom)
                      </span>
                      <h3 className="text-3xl font-bold text-stone-900 mt-4 leading-tight break-keep">
                        인간 손의 유연함과 정밀한 움직임을 구현하는 관절 설계
                      </h3>
                    </div>
                    
                    <p className="text-stone-600 text-base leading-relaxed break-keep">
                      HUMANICS 로봇은 <strong>양손 총 44자유도(각 손 22자유도)</strong>의 조작 계통을 보유하고 있습니다. 이 정밀한 구조는 텐던(Tendon, 힘줄) 구동 시스템을 결합하여 복잡한 도구 조작, 설거지 그릇 정리, 부드러운 터치 등 섬세한 일상 작업을 완벽히 자동화합니다.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="block text-stone-400 text-xs font-semibold mb-1">정밀 제어 양손</span>
                        <span className="text-lg font-bold text-stone-900">44 DoF (22 x 2)</span>
                      </div>
                      <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="block text-stone-400 text-xs font-semibold mb-1">인체 모사 양팔</span>
                        <span className="text-lg font-bold text-stone-900">14 DoF (7 x 2)</span>
                      </div>
                      <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="block text-stone-400 text-xs font-semibold mb-1">기타 (목, 척추, 다리)</span>
                        <span className="text-lg font-bold text-stone-900">17 DoF</span>
                      </div>
                    </div>
                  </div>

                  {/* 이미지 */}
                  <div className="lg:col-span-5 relative w-full h-[300px] lg:h-[380px] bg-stone-100 border border-stone-200 rounded-2xl overflow-hidden group shadow-inner">
                    <Image 
                      src="/robothand.png" 
                      alt="HUMANICS Robothand Joints" 
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                </div>
              ) : activeTab === "음성" ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 border border-stone-200 rounded-3xl shadow-sm">
                  {/* 설명 */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider bg-stone-100 px-3 py-1 rounded-full">
                        음성 인터페이스 (Voice Interface)
                      </span>
                      <h3 className="text-3xl font-bold text-stone-900 mt-4 leading-tight break-keep">
                        공간 인지 마이크 어레이 및 고급 음향 시스템
                      </h3>
                    </div>
                    
                    <p className="text-stone-600 text-base leading-relaxed break-keep">
                      HUMANICS 로봇은 3D 공간 음향 제어를 위해 다각도 빔포밍 마이크 어레이와 일체형 하이파이 스피커 모듈을 장착했습니다. 고주파 음역부터 단단한 베이스까지 전 음역대를 맑게 재생하며, 고성능 임베디드 자연어 처리(NLP) 엔진과 즉각 동기화되어 소음이 있는 거실에서도 속삭이는 목소리를 명확히 분리하여 인식합니다.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="block text-stone-400 text-xs font-semibold mb-1">음성 엔진</span>
                        <span className="text-lg font-bold text-stone-900">온디바이스 NLP</span>
                      </div>
                      <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="block text-stone-400 text-xs font-semibold mb-1">마이크 어레이</span>
                        <span className="text-lg font-bold text-stone-900">멀티 빔포밍</span>
                      </div>
                      <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="block text-stone-400 text-xs font-semibold mb-1">스피커 주파수</span>
                        <span className="text-lg font-bold text-stone-900">20Hz - 20kHz</span>
                      </div>
                    </div>
                  </div>

                  {/* 이미지 */}
                  <div className="lg:col-span-5 relative w-full h-[300px] lg:h-[380px] bg-stone-100 border border-stone-200 rounded-2xl overflow-hidden group shadow-inner">
                    <Image 
                      src="/voice_hardware.png" 
                      alt="HUMANICS Acoustic Speaker Joints" 
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                </div>
              ) : activeTab === "AI" ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 border border-stone-200 rounded-3xl shadow-sm">
                  {/* 설명 */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider bg-stone-100 px-3 py-1 rounded-full">
                        인공지능 & 컴퓨팅 (AI & Computing)
                      </span>
                      <h3 className="text-3xl font-bold text-stone-900 mt-4 leading-tight break-keep">
                        차세대 로보틱스 컴퓨터 및 고성능 AI 프로세서
                      </h3>
                    </div>
                    
                    <p className="text-stone-600 text-base leading-relaxed break-keep">
                      HUMANICS 로봇은 온디바이스 AI 구동을 위해 Nvidia Jetson Thor 및 독자적인 1X HUMANICS Cortex 프로세서를 탑재했습니다. 이 강력한 연산 시스템은 최대 2070 FP4 TFLOPS의 처리 능력을 지원하여, 복잡한 인공 신경망 연산, 3차원 공간 실시간 맵핑 및 인간 행동 패턴 분석을 지연 없이 실시간으로 수행합니다.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="block text-stone-400 text-xs font-semibold mb-1">메인 프로세서</span>
                        <span className="text-lg font-bold text-stone-900">1X Cortex / Nvidia Thor</span>
                      </div>
                      <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="block text-stone-400 text-xs font-semibold mb-1">AI 연산 능력</span>
                        <span className="text-lg font-bold text-stone-900">최대 2070 FP4 TFLOPS</span>
                      </div>
                    </div>
                  </div>

                  {/* 이미지 */}
                  <div className="lg:col-span-5 relative w-full h-[300px] lg:h-[380px] bg-stone-100 border border-stone-200 rounded-2xl overflow-hidden group shadow-inner">
                    <Image 
                      src="/ai_processor.png" 
                      alt="HUMANICS AI Processor Board" 
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                </div>
              ) : activeTab === "자율성" ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 border border-stone-200 rounded-3xl shadow-sm">
                  {/* 설명 */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider bg-stone-100 px-3 py-1 rounded-full">
                        자율성 & 내비게이션 (Autonomy & Navigation)
                      </span>
                      <h3 className="text-3xl font-bold text-stone-900 mt-4 leading-tight break-keep">
                        실시간 3차원 공간 인지 및 최적 경로 탐색 기술
                      </h3>
                    </div>
                    
                    <p className="text-stone-600 text-base leading-relaxed break-keep">
                      HUMANICS 로봇은 고출력 3D LiDAR 센서와 다각도 카메라 어레이를 결합한 실시간 온디바이스 SLAM(지도작성 및 위치추정) 기술을 사용합니다. 집안의 복잡한 통로나 장애물, 가구 배치 변경을 즉각적으로 인지하고, 실시간 포인트 클라우드 맵을 생성하여 안전하고 가장 최적화된 경로를 자율적으로 계획합니다.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="block text-stone-400 text-xs font-semibold mb-1">센서 시스템</span>
                        <span className="text-lg font-bold text-stone-900">LiDAR & Depth Cam</span>
                      </div>
                      <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="block text-stone-400 text-xs font-semibold mb-1">맵핑 기술</span>
                        <span className="text-lg font-bold text-stone-900">온디바이스 SLAM</span>
                      </div>
                      <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                        <span className="block text-stone-400 text-xs font-semibold mb-1">회피 모델</span>
                        <span className="text-lg font-bold text-stone-900">실시간 우회 경로</span>
                      </div>
                    </div>
                  </div>

                  {/* 이미지 */}
                  <div className="lg:col-span-5 relative w-full h-[300px] lg:h-[380px] bg-stone-100 border border-stone-200 rounded-2xl overflow-hidden group shadow-inner">
                    <Image 
                      src="/navigation.png" 
                      alt="HUMANICS Navigation Point Cloud Map" 
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                </div>
              ) : (
                SPECS_DATA[activeTab]?.map((spec, index) => {
                  if (activeTab === "디자인" && spec.label === "바디 구조") {
                    return (
                      <div 
                        key={index} 
                        className="p-6 border border-stone-200 rounded-2xl bg-white shadow-sm hover:border-stone-400 transition-colors duration-300 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center"
                      >
                        <div className="space-y-2">
                          <p className="text-stone-500 text-sm uppercase tracking-wider">
                            {spec.label}
                          </p>
                          <p className="text-xl md:text-2xl font-medium">
                            {spec.value}
                          </p>
                          <p className="text-stone-500 text-sm leading-relaxed pt-2 break-keep">
                            3D 프린팅된 정밀 삼차원 격자(Lattice) 폴리머 구조를 적용하여, 외부 충격을 유연하게 흡수하면서도 로봇의 신체 내부 기기를 안전하게 보호하는 소프트 바디 설계입니다.
                          </p>
                        </div>
                        <div className="relative w-full h-[160px] rounded-xl overflow-hidden bg-stone-50 border border-stone-150 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                          <Image 
                            src="/latticebody.png" 
                            alt="Lattice Body Structure" 
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    );
                  }

                  if (activeTab === "디자인" && spec.label === "구동 방식") {
                    return (
                      <div 
                        key={index} 
                        className="p-6 border border-stone-200 rounded-2xl bg-white shadow-sm hover:border-stone-400 transition-colors duration-300 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center"
                      >
                        <div className="space-y-2">
                          <p className="text-stone-500 text-sm uppercase tracking-wider">
                            {spec.label}
                          </p>
                          <p className="text-xl md:text-2xl font-medium">
                            {spec.value}
                          </p>
                          <p className="text-stone-500 text-sm leading-relaxed pt-2 break-keep">
                            모터의 회전력을 메탈 와이어와 도르래 시스템을 통해 관절로 직접 전달하여 인체의 근육과 힘줄의 유연한 복원력을 그대로 재현한 구동 방식입니다.
                          </p>
                        </div>
                        <div className="relative w-full h-[160px] rounded-xl overflow-hidden bg-stone-50 border border-stone-150 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                          <Image 
                            src="/tendondrive.png" 
                            alt="Tendon Drive Mechanism" 
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    );
                  }

                  if (activeTab === "디자인" && spec.label === "방수/방진") {
                    return (
                      <div 
                        key={index} 
                        className="p-6 border border-stone-200 rounded-2xl bg-white shadow-sm hover:border-stone-400 transition-colors duration-300 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center"
                      >
                        <div className="space-y-2">
                          <p className="text-stone-500 text-sm uppercase tracking-wider">
                            {spec.label}
                          </p>
                          <p className="text-xl md:text-2xl font-medium">
                            {spec.value}
                          </p>
                          <p className="text-stone-500 text-sm leading-relaxed pt-2 break-keep">
                            로봇의 외장은 물과 먼지 유입을 차단하는 고성능 엘라스토머 보호 피막으로 설계되었습니다. 손 부위는 IP68 등급으로 물속에서도 안전하여 설거지 및 세척 작업이 가능하며, 몸체는 IP44 등급의 생활 방수를 지원합니다.
                          </p>
                        </div>
                        <div className="relative w-full h-[160px] rounded-xl overflow-hidden bg-stone-50 border border-stone-150 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                          <Image 
                            src="/waterproof.png" 
                            alt="Waterproof and Dustproof Skin" 
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    );
                  }
                  
                  return (
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
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
