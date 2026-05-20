import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HistoricStrategy } from './historic.strategy';

export class GetProgressStrategy extends HistoricStrategy {
  async execute(userId: string, comicId?: number): Promise<any> {
    if (comicId === undefined) {
      throw new InternalServerErrorException('comicId is required for GetProgressStrategy');
    }

    const { data, error } = await this.supabase
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
        throw new NotFoundException('Progresso não encontrado para este usuário e tirinha.');
      }
      throw new InternalServerErrorException(error.message);
    }

    const { first, second, third, fourth } = data;
    
    let completedFrames = 0;
    if (first) completedFrames++;
    if (second) completedFrames++;
    if (third) completedFrames++;
    if (fourth) completedFrames++;

    const totalFrames = 4;
    const progress = (completedFrames / totalFrames) * 100;
    const started = completedFrames > 0;
    const completed = completedFrames === totalFrames;

    let status = 'NOT_STARTED';
    if (completed) {
      status = 'COMPLETED';
    } else if (started) {
      status = 'IN_PROGRESS';
    }

    return {
      comic_id: Number(comicId),
      progress,
      completed_frames: completedFrames,
      total_frames: totalFrames,
      status,
    };
  }
}
