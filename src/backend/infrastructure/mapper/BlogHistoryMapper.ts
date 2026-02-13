import { BlogHistoryEntity } from "@/backend/domain/entities/BlogHistory";

/** Supabase blog_history 테이블 행 타입 (snake_case) */
export interface BlogHistorySupabaseRow {
  id: string;
  user_id: string;
  topic: string;
  keywords: string[];
  style: string;
  result: {
    title: string;
    content: string;
    hashtags: string[];
    metaDescription: string;
  };
  created_at: string;
}

export function toBlogHistoryEntity(row: BlogHistorySupabaseRow): BlogHistoryEntity {
  return new BlogHistoryEntity(
    row.id,
    row.user_id,
    row.topic,
    row.keywords,
    row.style as BlogHistoryEntity["style"],
    {
      title: row.result.title,
      content: row.result.content,
      hashtags: row.result.hashtags,
      metaDescription: row.result.metaDescription,
    },
    new Date(row.created_at)
  );
}
