"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { id: "utility", label: "유틸리티" },
  { id: "design", label: "디자인" },
  { id: "companion", label: "동반자" },
  { id: "intelligence", label: "인공지능" },
  { id: "specs", label: "하드웨어 스펙" },
  { id: "faq", label: "자주 묻는 질문" },
];

export default function SubNav() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observers = new Map();

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -80% 0px", // 화면의 상단 부근에서 교차될 때 활성화
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    NAV_ITEMS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
        observers.set(id, element);
      }
    });

    return () => {
      observers.forEach((element) => observer.unobserve(element));
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // SubNav 높이만큼 오프셋
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-stone-50/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 overflow-x-auto no-scrollbar">
        <ul className="flex space-x-8 text-sm md:text-base font-medium whitespace-nowrap">
          {NAV_ITEMS.map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => scrollToSection(id)}
                className={`transition-colors duration-300 ${
                  activeSection === id ? "text-stone-900" : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
        <Link 
          href="/qna"
          className="hidden md:block bg-stone-900 text-stone-50 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-stone-800 transition-all hover:scale-105 active:scale-95 shadow-sm"
        >
          HUMANICS 예약하기
        </Link>
      </div>
    </nav>
  );
}

