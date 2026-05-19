import { Injectable } from '@nestjs/common';
import { ComicStrategy } from './comic-strategy.interface';

@Injectable()
export class ComicSearchStrategy implements ComicStrategy { // Adicionou o implements e nome corrigido
  async execute(supabaseClient: any, categoryName: string) {
    return await supabaseClient.rpc('get_comics_by_category', { category: categoryName });
  }
}