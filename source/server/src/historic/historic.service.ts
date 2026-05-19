import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class HistoricService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Busca todas as tirinhas que o usuário já começou a ler (pelo menos 1 quadro concluído),
   * mas que ainda não terminou (não possui os 4 quadros concluídos).
   *
   * @param userId - ID do usuário no Supabase.
   * @returns Lista de objetos contendo informações da tirinha e o status 'IN_PROGRESS'.
   */
  async getInProgress(userId: string) 
  {
    // Executa a busca na tabela Historic
    const { data, error } = await this.supabase.getInstance()
      .from('Historic')
      .select(`
        first,
        second,
        third,
        fourth,

        Comic!Historic_id_comic_fkey (
          id,
          name,
          image_url
        )
      `)
      .eq('id_user', userId);

    console.log('DATA:', data);
    console.log('ERROR:', error);

    // Lança exceção 500 se o Supabase retornar erro
    if (error) {
      throw new InternalServerErrorException(
        error.message,
      );
    }

    if (!data) {
      return [];
    }

    // Processa os dados retornados para filtrar apenas as tirinhas "em progresso"
    const inProgressComics = data
      .filter((historic: any) => {

        const {
          first,
          second,
          third,
          fourth,
        } = historic;

        // Se tiver algum como true, a leitura foi iniciada
        const started =
          first ||
          second ||
          third ||
          fourth;

        // Se tiver todos como true, a leitura foi completada
        const completed =
          first &&
          second &&
          third &&
          fourth;

        // Retorna apenas se já começou, mas ainda NÃO completou
        return started && !completed;
      })
      .map((historic: any) => {

        const comic = historic.Comic;

        return {
          comic_id: comic.id,
          title: comic.name,
          image_url: comic.image_url,
          status: 'IN_PROGRESS',
        };
      });

    return inProgressComics;
  }

  /**
   * Busca e calcula o progresso percentual e numérico (quadros completados)
   * de uma tirinha específica para um usuário.
   *
   * @param comicId - ID da tirinha que será verificada.
   * @param userId - ID do usuário no Supabase.
   * @returns Objeto com o status, total de quadros e o progresso em % (0 a 100).
   */
  async getProgress(comicId: number, userId: string) 
  {
    const { data, error } = await this.supabase.getInstance()
      .from('Historic')
      .select(`
        first,
        second,
        third,
        fourth
      `)
      .eq('id_comic', comicId)
      .eq('id_user', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {

        throw new NotFoundException(
          'Progresso não encontrado para este usuário e tirinha.',
        );
      }

      throw new InternalServerErrorException(
        error.message,
      );
    }

    const {
      first,
      second,
      third,
      fourth,
    } = data;

    // Calcula quantos quadros já foram lidos
    let completedFrames = 0;

    if (first) completedFrames++;
    if (second) completedFrames++;
    if (third) completedFrames++;
    if (fourth) completedFrames++;

    const totalFrames = 4;

    const progress =
      (completedFrames / totalFrames) * 100;

    const started =
      completedFrames > 0;

    const completed =
      completedFrames === totalFrames;

    let status = 'NOT_STARTED';

    if (completed) {

      status = 'COMPLETED';

    } else if (started) {

      status = 'IN_PROGRESS';
    }

    return {
      comic_id: comicId,
      progress,
      completed_frames: completedFrames,
      total_frames: totalFrames,
      status,
    };
  }
}