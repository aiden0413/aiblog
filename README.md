# AI Blog

주제와 키워드만 입력하면 OpenAI로 블로그 글(마크다운)을 자동 생성하는 웹 앱입니다.



## 소개 (Introduction)

**어떤 문제를 해결하는지**  
블로그 초안을 쓰는 데 시간이 많이 들고, 형식(튜토리얼 / TIL / 트러블슈팅)을 맞추기 어렵다는 부담을 줄이기 위해, 주제와 키워드만 넣으면 곧바로 초안이 나오도록 했습니다.

**왜 만들었는지**  
AI로 글 구조와 초안을 만들어 주는 도구가 있으면, 실제로 글을 쓸 때 집중할 부분(예: 코드 예시, 경험 정리)에만 시간을 쓸 수 있다고 생각해서 만들었습니다.

**핵심 기능 요약**

- 주제·키워드·글 스타일 선택 후 **한 번에 블로그 초안 생성**
- **튜토리얼 / TIL / 트러블슈팅** 형식 지원
- 생성 결과 **복사**, **MD/HTML 파일 다운로드**
- **히스토리**: 로그인 시 Supabase 저장·조회·삭제, 비로그인 시 로컬 스토리지
- **로그인/로그아웃** (Supabase Auth)
- **다크 모드**, **반응형** UI

---

## 데모 (Demo)

🔗 **Demo:** [https://aiblog-chi.vercel.app/](https://aiblog-chi.vercel.app/)

(스크린샷, GIF추가 예정)

---

## 기술 스택 (Tech Stack)

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router), React 19 |
| 언어·스타일 | TypeScript, Tailwind CSS 4 |
| 데이터·상태 | TanStack Query, Supabase (Auth·DB) |
| 에디터·변환 | Toast UI Editor (Prism 코드 하이라이트), marked |
| 기타 | OpenAI API (gpt-4o-mini), next-themes (다크 모드) |

---

## 설치 및 실행 (Getting Started)

**요구 사항**

- Node.js 18+
- [OpenAI API Key](https://platform.openai.com/api-keys)
- (선택) [Supabase](https://supabase.com) 프로젝트 — 로그인·서버 히스토리 사용 시

**1. 저장소 클론 및 의존성 설치**

```bash
git clone https://github.com/aiden0413/aiblog.git
cd aiblog
npm install
```

**2. 환경 변수 설정**

프로젝트 루트에 `.env.local` 파일을 만들고 아래를 설정하세요.

```env
# 필수: 글 생성용
OPENAI_API_KEY=your_openai_api_key_here

# 선택: 로그인·히스토리 저장용 (없으면 비로그인 + 로컬 스토리지만 사용)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**3. 개발 서버 실행**

```bash
npm run dev
```

**4. 빌드 후 실행 (선택)**

```bash
npm run build
npm start
```

---

## 사용 방법 (Usage)

- **접속**: 개발 서버 실행 후 [http://localhost:3000](http://localhost:3000) 에 접속합니다.
- **글 생성**: 랜딩에서 "글 생성하러 가기" → 주제·키워드(쉼표 구분)·글 스타일 선택 → 생성 버튼 클릭.
- **결과**: 제목, SEO 메타, 해시태그, 본문(마크다운)이 나오며, 복사·MD/HTML 다운로드가 가능합니다.
- **히스토리**: 우측(또는 하단) 히스토리 버튼으로 이전 생성 결과를 보고, 항목 클릭 시 다시 불러오거나 삭제할 수 있습니다.
- **로그인**: Supabase를 설정한 경우 헤더에서 로그인하면 히스토리가 서버에 저장됩니다.

---

## 폴더 구조

```
src/
├── app/
│   ├── (anon)/                    # 비인증 라우트
│   │   ├── create/                # 블로그 글 생성 페이지
│   │   │   ├── components/        # InputSection, ResultSection, HistoryPanel
│   │   │   └── page.tsx
│   │   ├── components/            # 공통 UI (Button, TextInput, MarkdownEditor 등)
│   │   │   └── Header/            # Header, UserMenu, LoginModal
│   │   ├── layout.tsx
│   │   └── page.tsx               # 랜딩
│   └── api/
│       ├── auth/callback/         # Supabase Auth 콜백
│       ├── generate/              # POST /api/generate (글 생성)
│       └── history/               # GET /api/history, DELETE /api/history/[id]
├── backend/
│   ├── applications/
│   │   ├── history/               # GetBlogHistoryUsecase, DeleteBlogHistoryUsecase, DTO
│   │   └── prompt/                # CreatePromptUsecase, GenerateRequestDto/ResponseDto
│   ├── domain/                    # 엔티티, 리포지토리 인터페이스
│   └── infrastructure/            # OpenAIRepository, SupabaseBlogHistoryRepository
├── hooks/                         # useGenerateBlog, useBlogHistory
├── lib/                           # blogHistory(로컬), supabase, AuthProvider, ThemeProvider, QueryProvider
└── types/
```

---

## API

모든 API는 JSON을 사용하며, 인증이 필요한 엔드포인트는 쿠키 기반 Supabase 세션을 사용합니다.

---

### `POST /api/generate`

블로그 글을 생성합니다. 로그인된 경우 생성 결과를 Supabase에 저장합니다.

**인증**: 선택 (있으면 해당 사용자로 히스토리 저장)

**요청**

- Method: `POST`
- Content-Type: `application/json`
- Body (JSON):

| 필드       | 타입     | 필수 | 설명                                      |
| ---------- | -------- | ---- | ----------------------------------------- |
| `topic`    | string   | O    | 블로그 주제 (공백 제거 후 비어 있으면 400) |
| `keywords` | string[] | O    | 관련 키워드 배열 (문자열만 유지)          |
| `style`    | string   | O    | `tutorial` \| `til` \| `troubleshooting`  |

**성공 응답** (200)

| 필드             | 타입     | 설명              |
| ---------------- | -------- | ----------------- |
| `title`          | string   | 제목              |
| `metaDescription`| string   | SEO 메타 설명     |
| `hashtags`       | string[] | 해시태그 배열     |
| `content`        | string   | 마크다운 본문     |

**에러 응답**

- 400: `{ "error": "잘못된 요청입니다. topic, keywords, style(...) 확인해주세요." }`
- 500: `{ "error": "메시지" }` (OpenAI/저장 실패 등)

---

### `GET /api/history`

히스토리 목록을 반환합니다. **로그인 필요.**

**인증**: 필수 (쿠키 세션)

**요청**

- Method: `GET`
- Query (선택):
  - `limit`: number — 조회 개수 제한 (미지정 시 기본 50)

**성공 응답** (200)

| 필드   | 타입   | 설명                |
| ------ | ------ | ------------------- |
| `items`| array  | 히스토리 항목 배열   |

`items[]` 각 항목:

| 필드       | 타입     | 설명                    |
| ---------- | -------- | ----------------------- |
| `id`       | string   | 항목 ID                 |
| `topic`    | string   | 주제                    |
| `keywords` | string[] | 키워드 배열             |
| `style`    | string   | `tutorial` \| `til` \| `troubleshooting` |
| `result`   | object   | 생성 결과 (아래)        |
| `createdAt`| string   | ISO 8601 생성 시각      |

`result` 구조:

| 필드             | 타입     |
| ---------------- | -------- |
| `title`          | string   |
| `metaDescription`| string   |
| `hashtags`       | string[] |
| `content`        | string   |

**에러 응답**

- 401: `{ "error": "로그인이 필요합니다." }`
- 500: `{ "error": "서버 설정 오류" }` (Supabase 미설정 등)

---

### `DELETE /api/history/[id]`

히스토리 항목을 삭제합니다. **로그인 필요.** 본인 항목만 삭제 가능.

**인증**: 필수 (쿠키 세션)

**요청**

- Method: `DELETE`
- Path: `id` — 삭제할 히스토리 항목 ID

**성공 응답**: 204 No Content (본문 없음)

**에러 응답**

- 400: `{ "error": "id가 필요합니다." }`
- 401: `{ "error": "로그인이 필요합니다." }`
- 404: `{ "error": "해당 히스토리를 찾을 수 없거나 삭제할 수 없습니다." }`
- 500: `{ "error": "메시지" }`

---

### `GET /api/auth/callback`

Supabase OAuth(이메일 링크 등) 로그인 후 리다이렉트되는 콜백입니다. 브라우저에서 호출됩니다.

**요청**

- Method: `GET`
- Query:
  - `code`: string (있으면) — Supabase가 넘겨준 인증 코드. 있으면 세션으로 교환 후 리다이렉트
  - `next`: string (선택) — 교환 후 이동할 경로. 기본값 `"/"`

**동작**

- `code`가 있으면: `exchangeCodeForSession(code)` 후 `{origin}/create?auth=complete` 로 리다이렉트
- `code`가 없으면: `{origin}{next}` 로 리다이렉트 (기본 `"/"`)
- Supabase 미설정 시: `next` 경로로만 리다이렉트

---

## 라이선스 (License)

Private
