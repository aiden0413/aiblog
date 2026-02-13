import type { BlogHistoryEntity } from "@/backend/domain/entities/BlogHistory";
import type { BlogHistoryRepository } from "@/backend/domain/repository/BlogHistoryRepository";
import type { GetHistoryRequestDto } from "../dtos/GetHistoryRequestDto";
import type {
  GetHistoryItemDto,
  GetHistoryResponseDto,
} from "../dtos/GetHistoryResponseDto";

const DEFAULT_LIMIT = 50;

function toItemDto(history: BlogHistoryEntity): GetHistoryItemDto {
  return {
    id: history.id,
    topic: history.topic,
    keywords: history.keywords,
    style: history.style,
    result: history.result,
    createdAt: history.createdAt.toISOString(),
  };
}

/** 사용자별 블로그 생성 히스토리 목록 조회 */
export class GetBlogHistoryUsecase {
  constructor(private readonly blogHistoryRepository: BlogHistoryRepository) {}

  async execute(
    userId: string,
    request: GetHistoryRequestDto = {}
  ): Promise<GetHistoryResponseDto> {
    const limit = request.limit ?? DEFAULT_LIMIT;
    const list = await this.blogHistoryRepository.findByUserId(userId, limit);
    return { items: list.map(toItemDto) };
  }
}
