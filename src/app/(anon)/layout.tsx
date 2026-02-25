import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "../../lib/AuthProvider";
import { QueryProvider } from "../../lib/QueryProvider";
import { getSupabase } from "@/lib/supabase/server";
import { ThemeProvider } from "../../lib/ThemeProvider";
import { AuthPopupCloser } from "../../lib/AuthPopupCloser";
import { Header } from "./components/Header/Header";
import { ToastProvider } from "./components/commons/Toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI 블로그 글 생성",
  description: "주제와 키워드로 튜토리얼, TIL, 트러블슈팅 형식의 블로그 글을 자동 생성합니다.",
};

/** 키보드가 올라와도 하단 푸터(버튼 바)가 가려지지 않도록 레이아웃 뷰포트 리사이즈 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await getSupabase();
  const { data: { session: initialSession } } = supabase
    ? await supabase.auth.getSession()
    : { data: { session: null } };

  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider initialSession={initialSession}>
            <QueryProvider>
              <ToastProvider>
                <AuthPopupCloser />
                <div className="flex h-dvh min-h-0 w-full flex-col overflow-hidden">
                <Header />
                <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
                  {children}
                </div>
              </div>
              <div id="modal-root" />
              </ToastProvider>
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
