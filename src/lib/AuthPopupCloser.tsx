"use client";

import { useEffect } from "react";

/** OAuth 팝업 로그인 완료 시 팝업 창 닫기 */
export function AuthPopupCloser() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (window.opener && params.get("auth") === "complete") {
      window.close();
      if (!window.closed) {
        window.location.replace("/create");
      }
    }
  }, []);

  return null;
}
