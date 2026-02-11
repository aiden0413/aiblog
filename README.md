# AI Blog

주제와 키워드를 입력하면 OpenAI를 사용해 블로그 글(마크다운)을 자동 생성하는 웹 앱입니다.

**배포:** [https://aiblog-chi.vercel.app/](https://aiblog-chi.vercel.app/)

## 주요 기능

- **블로그 글 생성**: 주제, 키워드(쉼표 구분), 글 스타일을 선택 후 생성
- **글 스타일**: 튜토리얼 / TIL / 트러블슈팅 중 선택
- **생성 결과**: 제목, SEO 메타 설명, 해시태그, 본문(마크다운) 제공
- **복사·다운로드**: 결과 복사, MD/HTML 파일 다운로드
- **히스토리**: 생성 이력을 로컬에 저장하고 이전 결과 다시 보기
- **다크 모드** 지원
- **반응형**: 데스크톱·모바일 레이아웃

## 기술 스택

- **Next.js** 16 (App Router)
- **React** 19
- **TypeScript**
- **Tailwind CSS** 4
- **TanStack Query** (React Query)
- **Toast UI Editor** (마크다운 에디터)
- **OpenAI API** (글 생성)
- **next-themes** (다크 모드)

## 시작하기

### 요구 사항

- Node.js 18+
- [OpenAI API Key](https://platform.openai.com/api-keys)

### 환경 변수

프로젝트 루트에 `.env.local` 파일을 만들고 다음을 설정하세요.

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 로 접속합니다.

### 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
src/
├── app/
│   ├── (anon)/              # 비인증 라우트
│   │   ├── create/          # 블로그 글 생성 페이지
│   │   │   ├── components/  # InputSection, ResultSection, HistoryPanel
│   │   │   └── page.tsx
│   │   ├── components/      # 공통 UI (Button, TextInput, MarkdownEditor 등)
│   │   └── layout.tsx
│   └── api/
│       └── generate/        # POST /api/generate (글 생성 API)
├── backend/                 # 도메인·유스케이스·인프라
│   ├── applications/prompt/  # CreatePromptUsecase, DTO
│   ├── domain/              # 엔티티, 리포지토리 인터페이스
│   └── infrastructure/      # OpenAIRepository (OpenAI 연동)
├── hooks/                   # useGenerateBlog 등
├── lib/                     # blogHistory, ThemeProvider, QueryProvider
└── types/
```

## API

### `POST /api/generate`

블로그 글을 생성합니다.

**요청 본문 (JSON)**

| 필드      | 타입     | 필수 | 설명                    |
|-----------|----------|------|-------------------------|
| `topic`   | string   | O    | 블로그 주제             |
| `keywords`| string[] | O    | 관련 키워드 배열        |
| `style`   | string   | O    | `tutorial` \| `til` \| `troubleshooting` |

**응답 (JSON)**

- `title`: 제목
- `metaDescription`: SEO 메타 설명
- `hashtags`: 해시태그 배열
- `content`: 마크다운 본문

## 라이선스

Private
