import { SearchComicStrategy } from './search_comic.strategy';
import { SupabaseClient } from '@supabase/supabase-js';
import { ComicInfo } from '../entities/comic_info.entity';

export class SearchUnreadStrategy extends SearchComicStrategy { // Adicionou o implements

  constructor(supabase: SupabaseClient) {
    super(supabase);
  }
  async execute(user_id: string): Promise<ComicInfo[]> 
  // CREATE FUNCTION public.get_unread_comics(user_id uuid)
  // RETURNS TABLE (
  //     id integer,
  //     name text,
  //     image_url text
  // )
  // AS $$
  //     SELECT
  //         comic.id,
  //         comic.name,
  //         comic.image_url
  //     FROM "Comic" AS comic
  //     WHERE comic.id NOT IN (
  //         SELECT historic.id_comic
  //         FROM "Historic" AS historic
  //         WHERE historic.id_user = user_id
  //     );
  // $$ LANGUAGE SQL;
  {
    const { data, error } = await this.supabase.rpc('get_unread_comics', { user_id: user_id });
    if(error) throw new Error(error.message); 
    return data;
  }
}