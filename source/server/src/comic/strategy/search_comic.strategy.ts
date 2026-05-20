import { SupabaseClient } from '@supabase/supabase-js';
import { ComicInfo } from '../entities/comic_info.entity';

// Essa e a interface que o flyan mencionou
export abstract class SearchComicStrategy {
  protected supabase: SupabaseClient;
  abstract execute(user_id: string, category_id: number): Promise<ComicInfo[]>;
  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
  }
}