import { Injectable } from '@nestjs/common';
import { SearchUnreadStrategy } from './strategy/search_unread_comic.strategy';
import { SearchUnreadByCategoryStrategy } from './strategy/search_unread_comic_by_category.strategy';
import { ReleaseNextFrameStrategy } from './strategy/release_next_frame.strategy';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Comic } from './entities/comic.entity';
import { UncoloredImage } from './entities/uncoloredImage.entity';
import { Status } from './entities/status.entity';
import { ComicInfo } from './entities/category.entity';


@Injectable() // O Nest garante que isso aqui é um Singleton automático por padrão
export class ComicService {
  private searchUnreadStrategy: SearchUnreadStrategy;
  private searchUnreadByCategoryStrategy: SearchUnreadByCategoryStrategy;
  private releaseNextFrameStrategy: ReleaseNextFrameStrategy;

  constructor(private readonly supabase: SupabaseService) {
    this.searchUnreadStrategy = new SearchUnreadStrategy(supabase.getInstance());
    this.searchUnreadByCategoryStrategy = new SearchUnreadByCategoryStrategy(supabase.getInstance());
    // Não precisa de supabase pois a lógica é puramente sobre o status
    this.releaseNextFrameStrategy = new ReleaseNextFrameStrategy();
  }

  async findByStrategy(strategyType: string, user_id: string, category_id: number = 0): Promise<ComicInfo[]> {
    // Em vez de chamar o banco direto aqui, delegamos para as classes do Strategy 
    if (strategyType === 'unread') return await this.searchUnreadStrategy.execute(user_id);
    return await this.searchUnreadByCategoryStrategy.execute(user_id, category_id);
  }

  private async getComic(comic_id: number): Promise<Comic> {
  /**
   * Retorna as informações de uma comic.
   */
  /*
    create function public.get_comic(comic_id integer)
    returns table(
      id integer,
      name text
    ) as $$
      select comic.id, comic.name
      from "Comic" as comic
      where comic.id = comic_id;
    $$ language sql;
  */  
    const { data, error } = await this.supabase.getInstance().rpc("get_comic",{comic_id: comic_id});
    if(error) throw new Error(error.message);
    return data;
  }

  private async getComicUncoloredImages(comic_id: number): Promise<UncoloredImage[]>
  /**
   * Retorna um array de imagens não coloridas de uma comic.
   */
  /*
    create function public.get_comic_uncolored_images(comic_id integer)
    returns table(
      enum integer,
      uncolored_image_url text
    )
    as $$ 
      select *
      from "Image"         
      where comic.id = comic_id;
    $$ language sql;
  */
  {
    const { data, error } = await this.supabase.getInstance().rpc("get_comic_uncolored_images", {comic_id: comic_id});
    if(error) throw new Error(error.message);
    return data;
  }

  async getNotStartedComic(comic_id: number): Promise<{comic_info: Comic, uncolored_comic_images: UncoloredImage[], status: Status}>
  {
    const comic_info = await this.getComic(comic_id);
    const  uncolored_comic_images = await this.getComicUncoloredImages(comic_id);
    const status: Status = {first: false, second: false, third: false, fourth: false};
    return {comic_info, uncolored_comic_images, status};
  }

  /**
   * Consulta o histórico do usuário no Supabase e delega para
   * a ReleaseNextFrameStrategy a decisão de qual quadro está disponível para pintar.
   *
   * @param comic_id - ID da tirinha.
   * @param user_id - ID do usuário.
   * @returns Objeto com current_frame, next_frame e can_paint.
   */
  async getNextFrameRelease(comic_id: number, user_id: string) {
    const { data, error } = await this.supabase
      .getInstance()
      .from('Historic')
      .select('first, second, third, fourth')
      .eq('id_comic', comic_id)
      .eq('id_user', user_id)
      .single();

    if (error) throw new Error(error.message);

    // Delega o algoritmo de decisão para a strategy — sem if/else aqui no service
    return this.releaseNextFrameStrategy.execute(data);
  }
}