"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { db, collection, addDoc } from "@/lib/firebase";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRect?: DOMRect | null;
}

export default function ReservationModal({ isOpen, onClose, triggerRect }: ReservationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [model, setModel] = useState("HUMANICS Standard (기본형)");
  const [agree, setAgree] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [coords, setCoords] = useState<{ top: number | string; left: number | string; transform: string; width: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (!isOpen) return;
      if (triggerRect && window.innerWidth >= 768) {
        const modalWidth = 480;
        const modalHeight = 580;
        const spacing = 12;

        let left = triggerRect.left + (triggerRect.width / 2) - (modalWidth / 2);
        left = Math.max(16, Math.min(left, window.innerWidth - modalWidth - 16));

        let top = triggerRect.top - modalHeight - spacing;
        
        if (triggerRect.top - modalHeight - spacing < 16) {
          top = triggerRect.bottom + spacing;
        }

        top = Math.max(16, Math.min(top, window.innerHeight - modalHeight - 16));

        setCoords({
          top: `${top}px`,
          left: `${left}px`,
          transform: 'none',
          width: `${modalWidth}px`
        });
      } else {
        setCoords({
          top: 'auto',
          left: 'auto',
          transform: 'none',
          width: '100%'
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isOpen, triggerRect]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validation
    if (!name.trim()) return setErrorMsg("이름을 입력해 주세요.");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErrorMsg("올바른 이메일 주소를 입력해 주세요.");
    if (!phone.trim() || !/^\d{2,3}-\d{3,4}-\d{4}$/.test(phone)) return setErrorMsg("올바른 연락처 형식(예: 010-1234-5678)으로 입력해 주세요.");
    if (!agree) return setErrorMsg("개인정보 처리방침 및 예치금 정책에 동의해 주세요.");

    setIsSubmitting(true);

    try {
      const reservationsRef = collection(db, "reservations");
      await addDoc(reservationsRef, {
        name,
        email,
        phone,
        model,
        amount: 200000, // 20만원 예치금
        status: "pending_payment"
      });

      setIsSuccess(true);
      setTimeout(() => {
        // Reset form and close
        setIsSuccess(false);
        setName("");
        setEmail("");
        setPhone("");
        setAgree(false);
        onClose();
      }, 2500);
    } catch (error) {
      console.error("Reservation submit error:", error);
      setErrorMsg("예약 신청에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:block overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-stone-200 shadow-2xl z-10 max-h-[85vh] overflow-y-auto md:absolute"
            style={coords ? {
              top: coords.top,
              left: coords.left,
              transform: coords.transform,
              maxWidth: coords.width
            } : undefined}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 transition-colors text-2xl"
              aria-label="닫기"
            >
              &times;
            </button>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 bg-stone-900 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-stone-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">사전 예약 완료!</h3>
                <p className="text-stone-500 break-keep">
                  HUMANICS 사전 예약이 임시 등록되었습니다.<br />
                  예치금 결제 안내 메일이 <strong>{email}</strong>로 발송됩니다.
                </p>
              </motion.div>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-stone-900">HUMANICS 사전 예약</h3>
                  <p className="text-stone-500 text-sm mt-1">
                    우선 예약을 위해 정보를 입력해 주세요. (예치금 20만 원 상당)
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">이름</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="홍길동"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-stone-900 focus:bg-white focus:outline-none transition-colors text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">이메일 주소</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@domain.com"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-stone-900 focus:bg-white focus:outline-none transition-colors text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">연락처</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010-1234-5678"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-stone-900 focus:bg-white focus:outline-none transition-colors text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1.5">모델 선택</label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:border-stone-900 focus:bg-white focus:outline-none transition-colors text-stone-900"
                    >
                      <option>HUMANICS Standard (기본형)</option>
                      <option>HUMANICS Pro (고성능/AI 특화)</option>
                      <option>HUMANICS Developer Edition (개발자 키트)</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-stone-900 border-stone-300 focus:ring-stone-900 cursor-pointer"
                      />
                      <span className="ml-2.5 text-xs text-stone-500 leading-normal break-keep">
                        (필수) 개인정보 수집·이용 동의 및 예치금(20만 원) 반환/취소 불가 규정을 확인하였으며 이에 동의합니다.
                      </span>
                    </label>
                  </div>

                  {errorMsg && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs font-medium"
                    >
                      {errorMsg}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-stone-900 text-stone-50 py-4 rounded-full text-base font-bold hover:bg-stone-800 disabled:bg-stone-300 transition-colors shadow-lg mt-4 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin h-5 w-5 text-stone-50 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : null}
                    예약 신청 및 결제 페이지 이동
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
