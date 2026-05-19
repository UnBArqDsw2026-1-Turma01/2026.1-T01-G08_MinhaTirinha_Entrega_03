import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

//encapsulando o fluxo completo
//decorator
@Injectable()
export class ComicProgressFacade {

  constructor(
    private readonly supabaseService: SupabaseService,
  ) {}

  async updateProgress(
    userId: string, // usuário
    comicId: number, // quadrinho atual
    field: 'first' | 'second' | 'third' | 'fourth', //área que foi concluída
  ) {

    const supabase = this.supabaseService.getInstance(); //conexão

    // Atualiza progresso
    const { error: updateError } = await supabase
      .from('Historic')
      .update({ 
        [field]: true,
      })
      //filtra qual registro será atualizado
      .eq('id_user', userId)
      .eq('id_comic', comicId);

    if (updateError) {
      throw updateError;
    }

    // Busca progresso atualizado
    const { data, error } = await supabase
      .from('Historic')
      .select('*') //busca o estado atual do quadrinho
      .eq('id_user', userId)
      .eq('id_comic', comicId)
      .single();

    if (error) {
      throw error;
    }

    // Verifica conclusão, se todos são true
    const completed =
      data.first &&
      data.second &&
      data.third &&
      data.fourth;

    // Libera próximo quadrinho
    if (completed) {

      const nextComicId = comicId + 1; //próximo quadrinho

      //novo progresso no banco, tudo começando com false pq o usuário ainda não pintou
      await supabase
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