# 구글 파이어베이스(Firebase) 자유게시판 연동 가이드

이 가이드는 로봇소프트웨어과 홈페이지의 **자유게시판**을 구글 파이어베이스(Firestore DB)와 연동하는 방법을 단계별로 설명합니다. 이 가이드를 따라 하시면 서버 없이도 게시판의 글쓰기, 수정, 삭제, 댓글 기능을 사용할 수 있습니다.

---

## 1단계: 파이어베이스 프로젝트 생성

1. [Firebase 콘솔](https://console.firebase.google.com/)에 접속하여 구글 계정으로 로그인합니다.
2. **프로젝트 만들기** 버튼을 클릭합니다.
3. 프로젝트 이름(예: `robot-sw-board`)을 입력하고 **계속**을 누릅니다.
4. (선택사항) Google 애널리틱스는 현재 테스트 목적이므로 비활성화해도 무방합니다. **프로젝트 만들기**를 클릭합니다.
5. 생성이 완료되면 **계속**을 눌러 프로젝트 대시보드로 이동합니다.

---

## 2단계: 웹 앱 추가 및 설정 정보 가져오기

1. 프로젝트 대시보드 화면 중앙의 `</>` (웹) 아이콘을 클릭합니다.
2. 앱 닉네임(예: `RobotWeb`)을 입력하고 **앱 등록**을 클릭합니다.
3. **'Firebase SDK 추가'** 화면이 나타납니다. 여기서 `const firebaseConfig = { ... }` 부분을 찾습니다.
4. `firebaseConfig` 안의 내용(apiKey, authDomain, projectId 등)을 복사해 둡니다.

---

## 3단계: 소스코드에 설정 정보 입력하기

1. 다운로드 받은 파일 중 `firebase-config.js` 파일을 메모장이나 코드 에디터(VS Code 등)로 엽니다.
2. 아래와 같이 2단계에서 복사한 본인의 설정값을 붙여넣기 합니다.

```javascript
// firebase-config.js 예시
const firebaseConfig = {
  apiKey: "AIzaSy본인의_API_키",
  authDomain: "프로젝트ID.firebaseapp.com",
  projectId: "프로젝트ID",
  storageBucket: "프로젝트ID.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456:web:abcd123"
};
```
3. 파일을 저장합니다. 이제 웹사이트가 본인의 파이어베이스와 연결되었습니다!

---

## 4단계: Firestore 데이터베이스 생성 및 규칙 설정

게시글 데이터를 저장할 공간을 만듭니다.

1. Firebase 콘솔 왼쪽 메뉴에서 **빌드(Build)** > **Firestore Database**를 클릭합니다.
2. **데이터베이스 만들기** 버튼을 클릭합니다.
3. 위치는 `asia-northeast3 (Seoul)`을 선택하고 **다음**을 누릅니다.
4. 시작 모드 선택 창에서 **테스트 모드에서 시작**을 선택하고 **만들기**를 클릭합니다.
   - *주의: 테스트 모드는 30일 동안 누구나 데이터에 접근할 수 있습니다. 30일 후에는 보안 규칙을 수정해야 합니다.*

### 보안 규칙 확인 (중요)
데이터베이스가 생성되면 상단의 **규칙(Rules)** 탭을 클릭하여 아래와 같이 되어 있는지 확인하세요. 만약 다르다면 아래 코드로 수정 후 **게시(Publish)**를 클릭하세요.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // 테스트용: 누구나 읽기/쓰기 가능
    }
  }
}
```

---

## 5단계: 컬렉션(Collection) 구조 (참고용)

데이터베이스가 설정되면, 우리가 만든 `board.js` 코드가 아래와 같은 구조로 데이터를 자동으로 생성하고 관리합니다. 콘솔에서 직접 만들 필요 없이 웹에서 글을 쓰면 자동으로 생성됩니다.

- `posts` (컬렉션: 게시글 목록)
  - `문서ID` (게시글 1)
    - `title`: 제목
    - `content`: 내용
    - `author`: 작성자
    - `password`: 비밀번호 (수정/삭제용)
    - `createdAt`: 작성일시
  - `문서ID` (게시글 2)...
- `comments` (컬렉션: 댓글 목록)
  - `문서ID` (댓글 1)
    - `postId`: 어떤 게시글의 댓글인지 연결고리
    - `author`: 작성자
    - `content`: 내용
    - `password`: 비밀번호
    - `createdAt`: 작성일시

---

## 6단계: 실행 및 테스트

1. 폴더 안의 `index.html` 파일을 더블클릭하여 브라우저에서 엽니다.
2. 상단 메뉴의 **[자유게시판]**을 클릭하여 게시판으로 이동합니다.
3. "글쓰기" 버튼을 눌러 테스트 글을 작성해 보세요.
4. 파이어베이스 콘솔의 Firestore Database > 데이터 탭에 방금 쓴 글이 정상적으로 등록되는지 확인합니다.

축하합니다! 이제 완벽하게 작동하는 데이터베이스 연동 게시판이 완성되었습니다.
