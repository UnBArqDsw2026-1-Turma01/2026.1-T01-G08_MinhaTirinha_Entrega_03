import { Injectable } from '@nestjs/common';
import { ComicInfo } from 'src/comic/entities/comic_info.entity';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SearchNotStartedStrategy } from './strategy';

@Injectable()
export class SearchNotStartedComicStrategy extends SearchNotStartedStrategy {
  constructor(private readonly supabase: SupabaseService) {
    super();
  }
  async search(user_id: string, category_id: number): Promise<ComicInfo[]> 
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
    const { data, error } = await this.supabase.getInstance().rpc('get_unread_comics', { user_id: user_id });
    if(error) throw new Error(error.message); 
    return data;
  }
}