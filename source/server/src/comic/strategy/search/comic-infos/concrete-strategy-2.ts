import { Injectable } from '@nestjs/common';
import { SearchNotStartedStrategy } from './strategy';
import { ComicInfo } from 'src/comic/entities/comic_info.entity';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class SearchNotStartedComicByCategoryStrategy extends SearchNotStartedStrategy { // Adicionou o implements e nome corrigido
  constructor(private readonly supabase: SupabaseService) {
    super();
  }
  async search(user_id: string, category_id: number): Promise<ComicInfo[]> 
  // CREATE FUNCTION public.get_unread_comics_by_category(user_id uuid, category_id integer)
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
  //     ) AND comic.id IN (
  //         SELECT category_comic.id_comic
  //         FROM "Category_Comic" as category_comic
  //         WHERE category_comic.id_category = category_id
  //     );
  // $$ LANGUAGE SQL;
  {
    const { data, error } =  await this.supabase.getInstance().rpc('get_unread_comics_by_category', { user_id: user_id, category_id: category_id });
    if(error) throw new Error(error.message); 
    return data}
}