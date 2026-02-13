import type { BlogHistoryEntity } from "../entities/BlogHistory";

/** 블로그 생성 히스토리 조회/삭제 Repository. 저장은 생성 시 OpenAIRepository에서 처리. */
export interface BlogHistoryRepository {
  /** 사용자별 히스토리 목록 조회 (최신순) */
  findByUserId(userId: string, limit?: number): Promise<BlogHistoryEntity[]>;

  /** id로 한 건 삭제. 해당 id가 해당 userId 소유인지 검증 후 삭제 */
  deleteById(id: string, userId: string): Promise<boolean>;
}
