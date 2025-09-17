# 🚀 [MinePing] - FrontEnd

## 📝 목차

1.  주요 페이지
2.  기술 스택
3.  시작하기
4.  사용 가능한 스크립트
5.  폴더 구조
6.  환경 변수

---

## ✨ 주요 페이지

- **로그인, 회원가입 페이지**
- **워케이션 리스트, 상세보기 페이지**
- **회사 워케이션 관련 직원관리 페이지**
- 워케이션 업체의 워케이션 등록 페이지
- 워케이션 예약 및 제휴신청 페이지
- 심리검사 및 식단추천 페이지

---

## 🛠️ 기술 스택

`package.json`을 기반으로 한 주요 기술 스택입니다.

| 구분                 | 내용                                                             |
| :------------------- | :--------------------------------------------------------------- |
| **Core**             | `React`, `Vite`                                                  |
| **State Management** | `Zustand`                                                        |
| **Routing**          | `React-router-dom`                                               |
| **Styling**          | `Styled-components`, `Emotion`, `MUI`                            |
| **Form**             | `React-hook-form`, `Yup`                                         |
| **Data Fetching**    | `Axios`                                                          |
| **UI/UX**            | `SweetAlert2`, `React-Toastify`, `React-Icons`, `React-Spinners` |
| **Code Quality**     | `ESLint`, `Prettier`                                             |
| **Mock Server**      | `json-server`                                                    |

---

## 🏁 시작하기

### 전제 조건

- **Node.js**: `v18.x` 이상
- **npm**: `v9.x` 이상

### 설치 및 실행

1.  **레포지토리 클론 후 `FrontEnd` 폴더로 이동**
    ```sh
    git clone [레포지토리 주소]
    cd [레포지토리 이름]/FrontEnd
    ```
2.  **필요한 패키지 설치**
    ```sh
    npm install
    ```
3.  **환경 변수 설정**
    `FrontEnd` 폴더에 `.env_example` 파일을 복사하여 `.env` 파일을 생성하고, 필요한 환경 변수를 설정합니다. 자세한 내용은 [환경 변수](#-환경-변수) 섹션을 참고하세요.
4.  **개발 서버 실행**
    두 개의 터미널을 열고 각각 다음 명령어를 실행합니다.
    - **터미널 1: Mock API 서버 실행**
      ```sh
      npm run server
      ```
    - **터미널 2: 개발 서버 실행**
      ```sh
      npm run dev
      ```
5.  브라우저에서 `http://localhost:5173/` (Vite 기본 포트)로 접속합니다.

---

## 📜 사용 가능한 스크립트

- `npm run dev`: 개발 모드로 앱을 실행합니다.
- `npm run build`: 프로덕션용으로 앱을 빌드합니다.
- `npm run lint`: ESLint를 사용하여 코드 스타일을 검사합니다.
- `npm run lint:fix`: ESLint가 발견한 문제를 자동으로 수정합니다.
- `npm run format`: Prettier를 사용하여 모든 파일의 코드 형식을 맞춥니다.
- `npm run preview`: 프로덕션 빌드 결과물을 로컬에서 미리 봅니다.
- `npm run server`: `db.json` 파일을 사용하는 `json-server`를 실행합니다.

---

## 📁 폴더 구조

```
src/
├── api/ # API 호출 관련 함수
├── assets/ # 이미지, 폰트 등 정적 파일
├── components/ # 공통 재사용 컴포넌트
├── config/ # 프로젝트 설정 관련
├── hooks/ # 커스텀 훅
├── pages/ # 라우팅되는 페이지 컴포넌트
├── store/ # 전역 상태 관리 (Zustand)
├── styles/ # 전역 스타일, 테마 등
├── App.jsx # 메인 애플리케이션 컴포넌트
└── main.jsx
```

---

## 🔑 환경 변수

프로젝트를 실행하기 위해 `FrontEnd` 폴더에 `.env` 파일이 필요합니다.
`.env_example` 파일을 참고하여 아래와 같이 변수를 설정해주세요. **실제 API 키 등의 민감 정보는 절대로 Git에 포함하지 마세요.**

```env
# .env.example

# 백엔드 API 서버 (로컬 개발 환경)
VITE_API_URL="http://localhost:8080/api"
VITE_API_TIMEOUT="5000"
VITE_API_VERSION="v1"

# 국세청 API 관련
VITE_API_BUSSINESS_BASE_URL="[https://api.odcloud.kr/api](https://api.odcloud.kr/api)"
VITE_API_BUSINESS_ENDPOINTS="/nts-businessman/v1/validate?serviceKey="
VITE_API_BUSSINESS_KEY="YOUR_BUSSINESS_API_KEY_HERE"

# CLOUDFRONT 관련
VITE_BASE_URL="http://localhost:8001"
VITE_CLOUDFRONT_DOMAIN="YOUR_CLOUDFRONT_DOMAIN_HERE.cloudfront.net"
```
