import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { GetInProgressStrategy } from './strategy/get_in_progress.strategy';
import { GetProgressStrategy } from './strategy/get_progress.strategy';

@Injectable()
export class HistoricService {
  private getInProgressStrategy: GetInProgressStrategy;
  private getProgressStrategy: GetProgressStrategy;

  constructor(private readonly supabase: SupabaseService) {
    const supabaseClient = this.supabase.getInstance();
    this.getInProgressStrategy = new GetInProgressStrategy(supabaseClient);
    this.getProgressStrategy = new GetProgressStrategy(supabaseClient);
  }

  /**
   * Busca todas as tirinhas que o usuário já começou a ler (pelo menos 1 quadro concluído),
   * mas que ainda não terminou (não possui os 4 quadros concluídos).
   * Delega a lógica para GetInProgressStrategy.
   *
   * @param userId - ID do usuário no Supabase.
   * @returns Lista de objetos contendo informações da tirinha e o status 'IN_PROGRESS'.
   */
  async getInProgress(userId: string) {
    return this.getInProgressStrategy.execute(userId);
  }

  /**
   * Busca e calcula o progresso percentual e numérico (quadros completados)
   * de uma tirinha específica para um usuário.
   * Delega a lógica para GetProgressStrategy.
   *
   * @param comicId - ID da tirinha que será verificada.
   * @param userId - ID do usuário no Supabase.
   * @returns Objeto com o status, total de quadros e o progresso em % (0 a 100).
   */
  async getProgress(comicId: number, userId: string) {
    return this.getProgressStrategy.execute(userId, comicId);
  }
}