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

- `POST /api/generate` — 글 생성 요청 (JSON)
  - body: `{ topic: string, keywords: string[], style: string }`
  - return: 블로그 마크다운 내용 (제목, SEO 메타, 해시태그, 본문)
- `GET /api/history` — 히스토리 목록 (로그인 필요)
- `DELETE /api/history/[id]` — 히스토리 항목 삭제 (로그인 필요)
- `GET /api/auth/callback` — Supabase 로그인 콜백

※ 내부 API라 외부 사용 목적은 아님.

---

## 라이선스 (License)

Private
