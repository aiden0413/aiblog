import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "../../lib/AuthProvider";
import { QueryProvider } from "../../lib/QueryProvider";
import { ThemeProvider } from "../../lib/ThemeProvider";
import { AuthPopupCloser } from "../../lib/AuthPopupCloser";
import { Header } from "./components/Header/Header";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              <AuthPopupCloser />
              <Header />
              {children}
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
