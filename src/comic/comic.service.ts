import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

// PADRÃO COMPORTAMENTAL: Strategy
interface ComicSearchStrategy {
  execute(userId: string, param?: string): Promise<any>;
}

class UnreadStrategy implements ComicSearchStrategy {
  constructor(private supabase: SupabaseClient) {}
  async execute(userId: string) {
    const { data, error } = await this.supabase.rpc('get_not_started_comics', { user_id: userId });
    if (error) throw error;
    return data;
  }
}

class CategoryStrategy implements ComicSearchStrategy {
  constructor(private supabase: SupabaseClient) {}
  async execute(userId: string, categoryId: string) {
    const { data, error } = await this.supabase.rpc('get_comics_by_category', { 
      user_id: userId, 
      category_id: categoryId 
    });
    if (error) throw error;
    return data;
  }
}

@Injectable() // PADRÃO: Singleton
export class ComicService {
  constructor(private readonly supabase: SupabaseClient) {}

  async findByStrategy(userId: string, type: 'unread' | 'category', categoryId?: string) {
    let strategy: ComicSearchStrategy;

    if (type === 'category') {
      if (!categoryId) throw new BadRequestException('ID da categoria é necessário.');
      strategy = new CategoryStrategy(this.supabase);
    } else {
      strategy = new UnreadStrategy(this.supabase);
    }

    return strategy.execute(userId, categoryId);
  }
}