"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Image from "next/image";

export default function HeroScrolly() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (containerRef.current && imageRef.current) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        animation: gsap.to(imageRef.current, {
          y: "20%",
          ease: "none",
        }),
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-stone-50 flex flex-col items-center justify-center overflow-hidden" id="hero">
      {/* 이미지 배경 (패럴랙스) */}
      <div className="absolute inset-0 w-full h-[120%] -top-[10%]">
        <Image
          ref={imageRef}
          src="/hero_top.png"
          alt="HUMANICS Hero"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
        {/* 상단 헤더 부분 가독성을 위한 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50/80 via-transparent to-transparent"></div>
      </div>

      {/* 하단 경계면 자연스럽게 페이드아웃 처리 */}
      <div className="absolute bottom-0 left-0 w-full h-48 md:h-64 bg-gradient-to-t from-stone-50 via-stone-50/90 to-transparent z-0 pointer-events-none"></div>

      {/* 오버레이 콘텐츠 */}
      <div className="relative z-10 text-center px-6 mt-16">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-stone-900 mb-6 drop-shadow-md">
          HUMANICS 가정용 로봇
        </h1>
        <div className="inline-block bg-white/60 backdrop-blur-md px-6 py-2 rounded-full mb-10 border border-white/50 shadow-sm">
          <p className="text-xl md:text-2xl text-stone-900 max-w-2xl mx-auto font-bold break-keep">
            당신의 시간을 되찾아주고 일상 업무를 돕는 개인 비서입니다.
          </p>
        </div>
        <div>
          <button 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("open-reservation-modal", { detail: { rect } }));
              }
            }}
            className="bg-stone-900 text-stone-50 px-8 py-4 rounded-full text-lg font-bold hover:bg-stone-800 transition-transform transform hover:scale-105 shadow-xl"
          >
            예치금 20만원 결제하기
          </button>
        </div>
      </div>

      {/* 3열 기능 그리드 (하단 배치) */}
      <div className="absolute bottom-10 left-0 w-full px-6 md:px-12 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {["도움의 손길", "시간의 확보", "유용한 인공지능"].map((item, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur-md border border-stone-200 p-6 rounded-2xl flex items-center space-x-4 shadow-lg">
              <div className="w-10 h-10 bg-stone-100 rounded-full flex-shrink-0 flex items-center justify-center">
                <span className="text-stone-900 font-bold">{idx + 1}</span>
              </div>
              <span className="text-lg font-semibold text-stone-900">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
