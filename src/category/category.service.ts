import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable() // PADRÃO: Singleton
export class CategoryService {
  constructor(private readonly supabase: SupabaseClient) {}

  async getCategories() {
    // PADRÃO: Facade para a lógica do banco (RPC)
    const { data, error } = await this.supabase.rpc('get_all_categories');
    if (error) throw error;
    return data;
  }
}