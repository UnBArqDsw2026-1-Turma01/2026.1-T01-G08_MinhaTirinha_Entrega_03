import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Category } from './entities/category.entity';

@Injectable() // PADRÃO: Singleton
export class CategoryService {
  constructor(private readonly supabase: SupabaseService) {}

  async getCategories(): Promise<Category[]> {
    // PADRÃO: Facade para a lógica do banco (RPC)
    const { data, error } = await this.supabase.getInstance().rpc('get_all_categories');
    if (error) throw error;
    return data;
  }
}