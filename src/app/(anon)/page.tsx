import Link from "next/link";

export default function Home() {
  return (
    <main className="h-[calc(100vh-81px)] flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white px-6 dark:from-zinc-900 dark:to-zinc-950 overflow-x-hidden overflow-y-auto">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-4xl font-bold text-black tracking-tight dark:text-white">
          AI 블로그 글 생성
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed dark:text-zinc-400">
          주제와 키워드만 입력하면 튜토리얼, TIL, 트러블슈팅 형식의 블로그 글을
          자동으로 작성해 드립니다.
        </p>
        <div className="pt-4">
          <Link
            href="/create"
            className="inline-flex h-12 min-w-[180px] items-center justify-center rounded border border-purple-500 bg-purple-500 px-6 font-medium text-white hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-600"
          >
            글 생성하러 가기
          </Link>
        </div>
      </div>
    </main>
  );
}
