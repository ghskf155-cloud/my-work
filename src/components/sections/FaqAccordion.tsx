"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

const FAQ_DATA = [
  {
    question: "HUMANICS는 언제 출시되나요?",
    answer: "HUMANICS는 현재 얼리 액세스 테스트 중입니다. 정식 출시일은 곧 발표될 예정입니다.",
  },
  {
    question: "HUMANICS는 집 안에서 어떻게 이동하나요?",
    answer: "HUMANICS는 최첨단 공간 인식 및 비전 모델을 사용하여 장애물, 반려동물, 사람을 피해 안전하게 이동합니다.",
  },
  {
    question: "아이들 주변에서도 안전한가요?",
    answer: "네. HUMANICS는 사람의 환경에서 부드럽고 안전하게 작동하도록 부드러운 바디, 맞춤형 격자 폴리머, 텐던(힘줄) 구동 방식으로 설계되었습니다.",
  },
  {
    question: "HUMANICS는 어떤 일을 할 수 있나요?",
    answer: "HUMANICS는 설거지 정리, 방 치우기, 물건 가져오기 등 다양한 집안일을 수행할 수 있습니다.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="bg-stone-50 text-stone-900 py-24 px-6 md:px-12 border-t border-stone-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 md:gap-0">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">자주 묻는 질문</h2>
          <a href="/qna" className="inline-flex items-center justify-center px-8 py-3 bg-stone-900 text-stone-50 rounded-full hover:bg-stone-800 transition-colors font-medium whitespace-nowrap">
            Q&A 게시판 가기
          </a>
        </div>
        <div className="space-y-4">
          {FAQ_DATA.map((item, index) => (
            <AccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => toggleAccordion(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function AccordionItem({ question, answer, isOpen, onClick }: { question: string; answer: string; isOpen: boolean; onClick: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        gsap.to(contentRef.current, {
          height: "auto",
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(contentRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  }, [isOpen]);

  return (
    <div className="border-b border-stone-200">
      <button
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className="text-xl md:text-2xl font-medium group-hover:text-stone-500 transition-colors">
          {question}
        </span>
        <span className={`text-2xl transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden h-0 opacity-0"
      >
        <p className="text-stone-600 text-lg pb-8 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}
