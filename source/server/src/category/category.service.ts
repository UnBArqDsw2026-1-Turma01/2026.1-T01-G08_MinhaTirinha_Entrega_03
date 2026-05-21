import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Category } from './entities/category.entity';

@Injectable() // PADRÃO: Singleton
export class CategoryService {
  constructor(private readonly supabase: SupabaseService) {}

  async getNotRead(user_id: string): Promise<Category[]> 
  // CREATE FUNCTION public.get_not_read_categories(user_id uuid)
  // RETURNS TABLE(
  //   id integer,
  //   name text
  // )
  // AS $$
  //   SELECT c.id, c.name
  //   FROM "Category" AS c JOIN "Category_Comic" AS cc ON  c.id = cc.id_category
  //   WHERE c.id NOT IN (
  //     SELECT cc.id_category
  //     FROM "Category_Comic" AS cc  JOIN "Historic" AS h ON cc.id_comic = h.id_comic
  //     WHERE h.id_user = user_id
  //     GROUP BY cc.id_category
  //   )
  //   GROUP BY c.id, cc.id_category
  //   ORDER BY c.id ASC
  // $$ LANGUAGE sql;
  {
    // PADRÃO: Facade para a lógica do banco (RPC)
    const { data, error } = await this.supabase.getInstance().rpc('get_not_read_categories', {user_id: user_id});
    if (error) throw error;
    return data;
  }
}
