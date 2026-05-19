import { Injectable } from '@nestjs/common';
import { ComicStrategy } from './comic-strategy.interface';

@Injectable()
export class UnreadStrategy implements ComicStrategy { // Adicionou o implements
  async execute(supabaseClient: any, userId: string) {
    return await supabaseClient.rpc('get_unread_comics', { user_id: userId });
  }
}