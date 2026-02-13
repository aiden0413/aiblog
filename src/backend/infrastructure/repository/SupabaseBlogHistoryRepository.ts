import type { BlogHistoryEntity } from "@/backend/domain/entities/BlogHistory";
import {
  toBlogHistoryEntity,
  type BlogHistorySupabaseRow,
} from "@/backend/infrastructure/mapper/BlogHistoryMapper";
import type { SupabaseClient } from "@supabase/supabase-js";

const TABLE = "blog_history";

export class SupabaseBlogHistoryRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findByUserId(
    userId: string,
    limit: number = 50
  ): Promise<BlogHistoryEntity[]> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select("id, user_id, topic, keywords, style, result, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return (data ?? []).map((row) =>
      toBlogHistoryEntity(row as BlogHistorySupabaseRow)
    );
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .select("id");

    if (error) throw new Error(error.message);
    return Array.isArray(data) && data.length > 0;
  }
}
