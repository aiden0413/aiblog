# AI Blog

주제와 키워드만 입력하면 OpenAI로 블로그 글(마크다운)을 자동 생성하는 웹 앱입니다.

**🔗 배포 URL:** [https://aiblog-chi.vercel.app/](https://aiblog-chi.vercel.app/)  

---

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
- **로그인/로그아웃** (Supabase Auth, Google OAuth)
- **회원가입**: 이메일 인증 + 가입 완료 페이지(`/signup/complete`) 후 로그인
- **다크 모드**, **반응형** UI

---

## 데모 (Demo)

위 **배포 URL**에서 바로 사용해 볼 수 있습니다.

---

## 주요 화면 (Screenshots)

- **랜딩 페이지**
  - 서비스 소개 + "글 생성하러 가기" 버튼이 보이는 화면
  - <img width="958" height="910" alt="캡처_2026_02_26_17_01_47_825" src="https://github.com/user-attachments/assets/9357b6a6-b804-4d15-93ef-d3b8c90e8703" />


- **블로그 글 생성 페이지 (데스크톱)**
  - 주제/키워드/스타일 입력과 결과(제목·SEO·해시태그·본문)가 함께 보이는 화면
  - <img width="958" height="910" alt="캡처_2026_02_26_17_03_14_284" src="https://github.com/user-attachments/assets/7b56fdde-4b78-4a70-bb08-d0328024c1d8" />


- **블로그 글 생성 페이지 (모바일)**
  - 모바일 레이아웃에서 입력/결과가 어떻게 보이는지 확인 가능한 화면
  - <img width="377" height="815" alt="캡처_2026_02_26_17_03_41_34" src="https://github.com/user-attachments/assets/323f4c99-4033-48f6-9601-1eee2ecf2128" />
  - <img width="377" height="815" alt="캡처_2026_02_26_17_03_43_193" src="https://github.com/user-attachments/assets/b0b6c108-24b0-491f-9d96-326d2301e9a2" />



- **히스토리 패널 (생성 화면 우측/하단)**
  - 생성 화면에서 히스토리 리스트와 항목 선택 시 재로딩 되는 모습
  - <img width="958" height="910" alt="캡처_2026_02_26_17_03_19_854" src="https://github.com/user-attachments/assets/ea09b4a0-9913-4915-8d3b-9a452a3c4b42" />


- **히스토리 페이지 (`/history`)**
  - 목록과 상세가 한 화면에 보이는 레이아웃
  - <img width="958" height="910" alt="캡처_2026_02_26_17_04_31_604" src="https://github.com/user-attachments/assets/e20acd34-5d7f-4874-a1e7-dc5e04740302" />


- **로그인 / 회원가입 (`/signin`, `/signup`, `/signup/complete`)**
  - Supabase Auth 로그인·회원가입(비밀번호 확인), 이메일 인증 후 가입 완료 페이지
  - <img width="958" height="910" alt="캡처_2026_02_26_17_02_11_932" src="https://github.com/user-attachments/assets/96370da9-ec25-415a-860a-58c21907d6df" />

  - <img width="958" height="910" alt="캡처_2026_02_26_17_02_15_84" src="https://github.com/user-attachments/assets/1d9e89a6-b8ee-41ba-81ef-eb2db4457efa" />


- **사용자 메뉴 + 회원 탈퇴 흐름**
  - 우측 상단 유저 메뉴 및 계정 삭제
  - <img width="239" height="209" alt="캡처_2026_02_26_17_04_10_575" src="https://github.com/user-attachments/assets/e88c6395-577b-453b-8e5e-4bdff4135335" />


- **다크 모드 / 라이트 모드 비교**
  - 같은 화면을 두 가지 테마로 비교
  - <img width="958" height="910" alt="캡처_2026_02_26_17_04_49_71" src="https://github.com/user-attachments/assets/64a25de6-1abd-4c08-97d0-9ae952a61c1c" />

  - <img width="958" height="910" alt="캡처_2026_02_26_17_04_51_786" src="https://github.com/user-attachments/assets/88ab3852-8cc8-4c92-a7a6-cf0ef8798204" />


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


## 사용 방법 (Usage)

- **접속**: 위 **배포 URL**에 접속합니다.
- **글 생성**: 랜딩에서 "글 생성하러 가기" → 주제·키워드(쉼표 구분)·글 스타일 선택 → 생성 버튼 클릭.
- **결과**: 제목, SEO 메타, 해시태그, 본문(마크다운)이 나오며, 복사·MD/HTML 다운로드가 가능합니다.
- **히스토리**: 글 생성 화면에서 우측(또는 하단) 히스토리 버튼으로 이전 결과를 보고, 항목 클릭 시 다시 불러오거나 삭제할 수 있습니다. **히스토리** 메뉴(/history)에서 목록·상세를 한 화면에서 볼 수도 있습니다.
- **로그인/회원가입**: 헤더에서 로그인·회원가입(/signin, /signup). 회원가입은 이메일 인증 후 `/signup/complete`에서 완료 → 로그인.
- **회원 탈퇴**: 로그인 후 사용자 메뉴에서 계정 삭제 가능.

---

## 폴더 구조

```
src/
├── app/
│   ├── (anon)/                    # 비인증 라우트
│   │   ├── create/                # 블로그 글 생성 페이지
│   │   │   ├── components/        # InputSection, ResultSection, HistoryPanel, ChipInput
│   │   │   ├── CreatePageDesktop.tsx, CreatePageMobile.tsx
│   │   │   └── page.tsx
│   │   ├── history/               # 히스토리 목록·상세 페이지
│   │   │   ├── components/        # HistoryListSection, HistoryDetailSection
│   │   │   ├── HistoryPageDesktop.tsx, HistoryPageMobile.tsx
│   │   │   ├── page.tsx, types.ts
│   │   │   └── ...
│   │   ├── signin/                 # 로그인
│   │   ├── signup/                 # 회원가입
│   │   │   └── complete/           # 가입 완료 페이지
│   │   ├── components/
│   │   │   ├── commons/           # Button, TextInput, MarkdownEditor, Toast, HistoryItemCard, ConfirmModal
│   │   │   └── Header/            # Header, UserMenu
│   │   ├── layout.tsx
│   │   └── page.tsx               # 랜딩
│   └── api/
│       ├── auth/callback/        # Supabase Auth 콜백
│       ├── auth/delete-account/  # POST 회원 탈퇴 (로그인 필요)
│       ├── generate/              # POST /api/generate (글 생성)
│       └── history/               # GET /api/history, DELETE /api/history/[id]
├── backend/
│   ├── applications/
│   │   ├── history/               # GetBlogHistoryUsecase, DeleteBlogHistoryUsecase, DTO
│   │   └── prompt/                # CreatePromptUsecase, GenerateRequestDto/ResponseDto
│   ├── domain/                    # 엔티티, 리포지토리 인터페이스
│   └── infrastructure/            # OpenAIRepository, SupabaseBlogHistoryRepository, BlogHistoryMapper
├── hooks/                         # useGenerateBlog, useBlogHistory
├── lib/                           # blogHistory(로컬), supabase, AuthProvider, ThemeProvider, QueryProvider, ToastProvider, AuthPopupCloser
└── types/
```

---

## API

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/generate` | 글 생성. body: `topic`, `keywords[]`, `style`(tutorial/til/troubleshooting) → 블로그 마크다운(제목, SEO 메타, 해시태그, 본문) 반환 |
| GET | `/api/history` | 히스토리 목록 (로그인 필요) |
| DELETE | `/api/history/[id]` | 히스토리 항목 삭제 (로그인 필요) |
| GET | `/api/auth/callback` | Supabase Auth 콜백 (이메일 인증 → `/signup/complete`, OAuth → `/create`) |
| POST | `/api/auth/delete-account` | 회원 탈퇴 (로그인 필요) |
