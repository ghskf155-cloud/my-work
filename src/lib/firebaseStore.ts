"use client";

export interface Inquiry {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  createdAt: string;
}

// 환경변수로부터 Firebase 프로젝트 ID 획득
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";

// 로컬 스토리지 키 정의
const LOCAL_STORAGE_KEY = "humanics_inquiries_backup";

// 초기 디폴트 데이터
const DEFAULT_INQUIRIES: Inquiry[] = [
  {
    id: "default-1",
    title: "배송은 언제쯤 시작되나요?",
    content: "얼리 액세스 예약 구매 시 배송 일정이 궁금합니다.",
    author: "구매희망자1",
    date: "2026-05-18",
    createdAt: new Date("2026-05-18").toISOString(),
  },
  {
    id: "default-2",
    title: "A/S 보증 기간과 절차가 어떻게 되나요?",
    content: "배터리 수명 및 관절 모듈에 대한 보증 범위가 궁금합니다.",
    author: "로봇사랑",
    date: "2026-05-17",
    createdAt: new Date("2026-05-17").toISOString(),
  },
];

// 로컬 스토리지 도우미
const getLocalInquiries = (): Inquiry[] => {
  if (typeof window === "undefined") return DEFAULT_INQUIRIES;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_INQUIRIES));
      return DEFAULT_INQUIRIES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error("Local storage error:", e);
    return DEFAULT_INQUIRIES;
  }
};

const saveLocalInquiry = (inquiry: Inquiry) => {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalInquiries();
    const updated = [inquiry, ...current];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Local storage write error:", e);
  }
};

/**
 * Firestore REST API 데이터를 정규 Inquiry 인터페이스로 매핑
 */
function mapFirestoreDoc(doc: any): Inquiry {
  const fields = doc.fields || {};
  return {
    id: doc.name.split("/").pop() || Math.random().toString(),
    title: fields.title?.stringValue || "",
    content: fields.content?.stringValue || "",
    author: fields.author?.stringValue || "익명사용자",
    date: fields.date?.stringValue || new Date().toISOString().split("T")[0],
    createdAt: fields.createdAt?.stringValue || doc.createTime || new Date().toISOString(),
  };
}

/**
 * 실시간 예약 및 Q&A 목록을 조회합니다.
 * Firebase 설정이 유효하면 Firestore REST API를 이용하고, 실패하거나 설정이 없으면 LocalStorage 백업 저장소를 활용합니다.
 */
export async function fetchInquiries(): Promise<{ data: Inquiry[]; isCloud: boolean }> {
  if (!FIREBASE_PROJECT_ID) {
    console.log("💡 [Firebase Store] 프로젝트 ID가 비어있어 로컬 스토리지를 활용합니다.");
    return { data: getLocalInquiries(), isCloud: false };
  }

  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/inquiries?pageSize=50`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Firestore REST API HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const documents = result.documents || [];
    const mapped = documents.map((doc: any) => mapFirestoreDoc(doc));
    
    // 생성시간 내림차순 정렬
    mapped.sort((a: Inquiry, b: Inquiry) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return { data: mapped.length > 0 ? mapped : getLocalInquiries(), isCloud: true };
  } catch (error) {
    console.warn("⚠️ [Firebase Store] Firestore 연결 실패, 로컬 스토리지로 보조 작동합니다:", error);
    return { data: getLocalInquiries(), isCloud: false };
  }
}

/**
 * 새로운 예약 문의를 등록합니다.
 */
export async function createInquiry(title: string, content: string, author = "익명사용자"): Promise<{ success: boolean; isCloud: boolean }> {
  const newInquiry: Inquiry = {
    id: `local-${Date.now()}`,
    title,
    content,
    author,
    date: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  };

  // 1단계: 즉각적인 로컬 로컬에 동기화 보장 (안정성 보장)
  saveLocalInquiry(newInquiry);

  if (!FIREBASE_PROJECT_ID) {
    return { success: true, isCloud: false };
  }

  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/inquiries`;

  try {
    const body = {
      fields: {
        title: { stringValue: title },
        content: { stringValue: content },
        author: { stringValue: author },
        date: { stringValue: newInquiry.date },
        createdAt: { stringValue: newInquiry.createdAt },
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Firestore write HTTP error! status: ${response.status}`);
    }

    return { success: true, isCloud: true };
  } catch (error) {
    console.error("⚠️ [Firebase Store] Firestore 저장 실패, 로컬 스토리지에 백업되었습니다:", error);
    return { success: true, isCloud: false }; // 로컬 저장이 완료되었으므로 사용자에게는 성공으로 피드백 제공
  }
}
