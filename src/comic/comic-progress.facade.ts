import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ComicProgressFacade {

  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async updateProgress(
    userId: string,
    comicId: number,
    field: 'first' | 'second' | 'third' | 'fourth',
  ) {

    // Atualiza etapa concluída
    const { error: updateError } = await this.supabase
      .from('Historic')
      .update({
        [field]: true,
      })
      .eq('id_user', userId)
      .eq('id_comic', comicId);

    if (updateError) {
      throw new BadRequestException(updateError.message);
    }

    // Busca progresso atualizado
    const { data, error } = await this.supabase
      .from('Historic')
      .select('*')
      .eq('id_user', userId)
      .eq('id_comic', comicId)
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    // Verifica se concluiu tudo
    const completed =
      data.first &&
      data.second &&
      data.third &&
      data.fourth;

    // Libera próximo quadrinho
    if (completed) {

      const nextComicId = comicId + 1;

      await this.supabase
        .from('Historic')
        .insert({
          id_user: userId,
          id_comic: nextComicId,
          first: false,
          second: false,
          third: false,
          fourth: false,
        });
    }

    return {
      completed,
      message: completed
        ? 'Próximo quadrinho liberado.'
        : 'Progresso atualizado.',
    };
  }
}