"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "./supabase/client";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isConfigured: boolean;
  /** Google 로그인 실패 시 메시지 (팝업 차단, OAuth 오류 등) */
  signInError: string | null;
  clearSignInError: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  /** 서버에서 조회한 세션. 첫 렌더 전에 로그인 여부를 알 수 있게 함 */
  initialSession?: Session | null;
}

export function AuthProvider({ children, initialSession = null }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(initialSession ?? null);
  const [isLoading, setIsLoading] = useState(true);
  const [signInError, setSignInError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setIsLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithGoogle = async () => {
    if (!supabase) return;
    setSignInError(null);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      setSignInError(error.message ?? "Google 로그인을 시작할 수 없습니다.");
      return;
    }
    if (!data?.url) {
      setSignInError("Google 로그인을 시작할 수 없습니다.");
      return;
    }

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      data.url,
      "oauth",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      setSignInError("팝업이 차단되었습니다. 브라우저에서 팝업을 허용한 뒤 다시 시도해주세요.");
      return;
    }

    const interval = setInterval(() => {
      if (popup.closed) {
        clearInterval(interval);
        supabase.auth.getSession().then(({ data: { session: s } }) => {
          setSession(s);
          if (s) window.location.href = "/create";
        });
      }
    }, 500);
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    isLoading,
    isConfigured: !!supabase,
    signInError,
    clearSignInError: () => setSignInError(null),
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
