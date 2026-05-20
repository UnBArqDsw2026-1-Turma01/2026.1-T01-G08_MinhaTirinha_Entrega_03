import { InternalServerErrorException } from '@nestjs/common';
import { HistoricStrategy } from './historic.strategy';

export class GetInProgressStrategy extends HistoricStrategy {
  async execute(userId: string): Promise<any> {
    const { data, error } = await this.supabase
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

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      return [];
    }

    const inProgressComics = data
      .filter((historic: any) => {
        const { first, second, third, fourth } = historic;
        const started = first || second || third || fourth;
        const completed = first && second && third && fourth;
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
}
