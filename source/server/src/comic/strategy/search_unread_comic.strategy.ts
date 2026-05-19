import { SearchComicStrategy } from './search_comic.strategy';
import { SupabaseClient } from '@supabase/supabase-js';
import { ComicInfo } from '../entities/category.entity';

export class SearchUnreadStrategy extends SearchComicStrategy { // Adicionou o implements

  constructor(supabase: SupabaseClient) {
    super(supabase);
  }
  async execute(user_id: string): Promise<ComicInfo[]> {
    const { data, error } = await this.supabase.rpc('get_unread_comics', { user_id: user_id });
    if(error) throw new Error(error.message); 
    return data;
  }
}