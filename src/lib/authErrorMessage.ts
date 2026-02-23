/** Supabase Auth 영문 오류 메시지를 한국어로 변환. 알 수 없는 오류는 '오류가 발생했습니다.' 반환 */
export function getAuthErrorMessage(message: string): string {
  const map: Record<string, string> = {
    "Invalid login credentials":
      "이메일 또는 비밀번호가 올바르지 않습니다.",
    "Email not confirmed": "이메일 인증이 필요합니다.",
    "Email rate limit exceeded":
      "이메일 발송 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.",
    "User already registered": "이미 가입된 이메일입니다.",
    "Signup requires a valid password":
      "비밀번호를 올바르게 입력해 주세요.",
    "Password should be at least 6 characters":
      "비밀번호는 6자 이상이어야 합니다.",
    "Unable to validate email address: invalid format":
      "올바른 이메일 주소를 입력해 주세요.",
    "Forbidden": "접근이 거부되었습니다.",
    "Invalid email or password": "이메일 또는 비밀번호가 올바르지 않습니다.",
  };

  const trimmed = message.trim();
  for (const [en, ko] of Object.entries(map)) {
    if (trimmed === en || trimmed.startsWith(en)) return ko;
  }
  if (/invalid format|invalid email|is invalid/i.test(trimmed)) {
    return "올바른 이메일 주소를 입력해 주세요.";
  }
  if (/rate limit|too many requests/i.test(trimmed)) {
    return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
  }
  return "오류가 발생했습니다.";
}
