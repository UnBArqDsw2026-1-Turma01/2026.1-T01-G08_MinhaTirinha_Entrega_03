import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UnreadStrategy } from './dtos/unread-strategy.dto';
import { ComicSearchStrategy } from './dtos/category-strategy.dto';

@Injectable() // O Nest garante que isso aqui é um Singleton automático por padrão
export class ComicService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly unreadStrategy: UnreadStrategy,
    private readonly categoryStrategy: ComicSearchStrategy,
  ) {}

  async findByStrategy(strategyType: string, payload: any) {
    // Em vez de chamar o banco direto aqui, delegamos para as classes do Strategy 
    if (strategyType === 'category') {
      return await this.categoryStrategy.execute(this.supabaseService, payload.category);
    }
    
    return await this.unreadStrategy.execute(this.supabaseService, payload.userId);
  }

  //service das cores
  async getComicImages(comicId: number) {

  const supabase = this.supabaseService.getInstance();

  const { data, error } = await supabase
    .from('Image') //seleciona a tabela
    .select(`*`) //busca todas as colunas
    .eq('id_comic', comicId); //filtro

  if (error) {
    throw error;
  }

  return data;
}

}