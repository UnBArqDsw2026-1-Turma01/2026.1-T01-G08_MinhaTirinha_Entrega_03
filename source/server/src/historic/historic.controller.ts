import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { HistoricService } from './historic.service';

/**
 * Controller responsável por gerenciar as rotas relacionadas ao histórico de leitura.
 * Recebe as requisições HTTP, extrai os parâmetros e repassa para a camada de Service.
 */
@Controller('historic')
export class HistoricController {
  constructor(private readonly historicService: HistoricService) {}
  /**
   * Rota: GET /historic/in-progress/:userId
   * Objetivo: Retornar a lista de tirinhas iniciadas e não finalizadas pelo usuário.
   */
  @Get('in-progress/:userId')
  async getInProgress(@Param('userId') userId: string) {
    return this.historicService.getInProgress(userId);
  }

  /**
   * Rota: GET /historic/progress/:comicId/:userId
   * Objetivo: Retornar o progresso (em porcentagem e quadros) de uma tirinha específica.
   */
  @Get('progress/:comicId/:userId')
  async getProgress(@Param('comicId') comicId: number, @Param('userId') userId: string) {
    return this.historicService.getProgress(comicId,userId,);
  }
}