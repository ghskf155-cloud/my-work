// 사용자의 파이어베이스 설정값
const firebaseConfig = {
  apiKey: "AIzaSyAYsbUe9ACOtyvW7-hNdnNQnDxH6SFOV3g",
  authDomain: "project-5079082060049586778.firebaseapp.com",
  projectId: "project-5079082060049586778",
  storageBucket: "project-5079082060049586778.firebasestorage.app",
  messagingSenderId: "550502662918",
  appId: "1:550502662918:web:3aafcb6f8fe792fc309487",
  measurementId: "G-XZXMTSM9LH"
};

// 파이어베이스 초기화 (전역 변수 방식)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 애널리틱스 초기화 (지원되는 경우에만)
firebase.analytics.isSupported().then(supported => {
  if (supported) firebase.analytics();
});
