import { SearchComicStrategy } from './search_comic.strategy';
import { SupabaseClient } from '@supabase/supabase-js';
import { ComicInfo } from '../entities/comic_info.entity';

export class SearchUnreadByCategoryStrategy extends SearchComicStrategy { // Adicionou o implements e nome corrigido

  constructor(supabase: SupabaseClient) {
    super(supabase);
  }
  async execute(user_id: string, category_id: number): Promise<ComicInfo[]> 
  {
    const { data, error } =  await this.supabase.rpc('get_unread_comics_by_category', { user_id: user_id, category_id: category_id });
    if(error) throw new Error(error.message); 
    return data}
}