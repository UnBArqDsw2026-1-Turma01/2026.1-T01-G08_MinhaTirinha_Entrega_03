import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UnreadStrategy } from './dtos/unread-strategy.dto';
import { ComicSearchStrategy } from './dtos/category-strategy.dto';

@Injectable() // O Nest garante que isso aqui é um Singleton automático por padrão! [cite: 112, 115]
export class ComicService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly unreadStrategy: UnreadStrategy,
    private readonly categoryStrategy: ComicSearchStrategy,
  ) {}

  async findByStrategy(strategyType: string, payload: any) {
    // Em vez de chamar o banco direto aqui, delegamos para as classes do Strategy [cite: 58, 426]
    if (strategyType === 'category') {
      return await this.categoryStrategy.execute(this.supabaseService, payload.category);
    }
    
    return await this.unreadStrategy.execute(this.supabaseService, payload.userId);
  }
}