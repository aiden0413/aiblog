"use client";

import { Component } from "react";
import dynamic from "next/dynamic";

const MarkdownEditor = dynamic(
  () =>
    import("@/app/(anon)/components/MarkdownEditor/MarkdownEditor").then(
      (mod) => ({ default: mod.MarkdownEditor })
    ),
  { ssr: false }
);

const SAMPLE_MARKDOWN = `# 마크다운 에디터 테스트

마크다운의 다양한 문법을 테스트합니다. **굵은 글씨**, *기울임*, \`인라인 코드\`가 잘 나오는지 확인해보세요.

---

## 1. 제목 계층

### H3 제목
#### H4 제목
##### H5 제목

---

## 2. 코드 블록

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email?: string;
}

const fetchUser = async (id: number): Promise<User> => {
  const res = await fetch("/api/users/" + id);
  return res.json();
};
\`\`\`

\`\`\`python
def factorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 120
\`\`\`

\`\`\`css
.container {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
}

.container > * {
  flex: 1;
}
\`\`\`

---

## 3. 목록

### 순서 없는 목록
- 첫 번째 항목
- 두 번째 항목
  - 중첩 항목 A
  - 중첩 항목 B
- 세 번째 항목

### 순서 있는 목록
1. 첫 번째 단계
2. 두 번째 단계
3. 세 번째 단계

---

## 4. 인용문

> 프로그래밍은 생각을 표현하는 또 다른 언어다.
> — 알란 케이

> 중첩 인용문
>> 더 깊은 인용

---

## 5. 링크 & 이미지

[Google](https://google.com) | [GitHub](https://github.com)

---

## 6. 테이블

| 언어 | 타입 | 용도 |
|------|------|------|
| TypeScript | 정적 | 웹 프론트엔드 |
| Python | 동적 | AI, 데이터 분석 |
| Go | 정적 | 서버, CLI |

---

## 7. 수평선

위에 수평선이 있고,

---

아래에도 있습니다.
`;

export default class EditorTestPage extends Component {
  render() {
    return (
      <main className="min-h-screen p-8">
        <MarkdownEditor text={SAMPLE_MARKDOWN} editable height="600px" minHeight="400px" />
      </main>
    );
  }
}
