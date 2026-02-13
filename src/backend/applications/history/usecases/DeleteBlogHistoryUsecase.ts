import type { BlogHistoryRepository } from "@/backend/domain/repository/BlogHistoryRepository";
import type { DeleteHistoryRequestDto } from "../dtos/DeleteHistoryRequestDto";
import type { DeleteHistoryResponseDto } from "../dtos/DeleteHistoryResponseDto";

/** 사용자 소유의 히스토리 한 건 삭제 */
export class DeleteBlogHistoryUsecase {
  constructor(private readonly blogHistoryRepository: BlogHistoryRepository) {}

  async execute(
    request: DeleteHistoryRequestDto,
    userId: string
  ): Promise<DeleteHistoryResponseDto | null> {
    const deleted = await this.blogHistoryRepository.deleteById(
      request.id,
      userId
    );
    return deleted ? { deleted: true } : null;
  }
}
