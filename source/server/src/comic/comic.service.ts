import { Injectable } from '@nestjs/common';
import { SearchNotStartedComicStrategy } from './strategy/search/comic-infos/concrete-stratey-1';
import { SearchNotStartedComicByCategoryStrategy, } from './strategy/search/comic-infos/concrete-strategy-2';
import { SupabaseService } from 'src/supabase/supabase.service';
import { ComicInfo } from './entities/comic_info.entity';
import { GetComic } from './entities/get_comic.entity';
import { StartedComicInfo } from './entities/started_comic_info';
import { UpdateStrategy } from './strategy/update/strategy';
import { FirstUpdateStrategy } from './strategy/update/concrete-strategy-1';
import { SecondUpdateStrategy } from './strategy/update/concrete-strategy-2';
import { ThirdUpdateStrategy } from './strategy/update/concrete-strategy-3';
import { FourthUpdateStrategy } from './strategy/update/concrete-strategy-4';
import { UpdateComicDto } from './dto/update-comic.dto';
import { CreateComicDto } from './dto/create-comic.dto';
import { SearchNotStartedStrategy } from './strategy/search/comic-infos/strategy';
import { GetComicStrategy } from './strategy/search/comic/strategy';
import { GetStartedComicStrategy } from './strategy/search/comic/concrete-strategy-1';
import { GetNotStartedComicStrategy } from './strategy/search/comic/concrete-strategy-2';

@Injectable() // O Nest garante que isso aqui é um Singleton automático por padrão
export class ComicService {

  constructor(
    private readonly supabase: SupabaseService,
    private readonly firstUpdateStrategy: FirstUpdateStrategy,
    private readonly secondUpdateStrategy: SecondUpdateStrategy,
    private readonly thirdUpdateStrategy: ThirdUpdateStrategy,
    private readonly fourthUpdateStrategy: FourthUpdateStrategy,
    private readonly searchNotStartedComicStrategy: SearchNotStartedComicStrategy,
    private readonly searchNotStartedComicByCategoryStrategy: SearchNotStartedComicByCategoryStrategy,
    private readonly getStartedComicStrategy: GetStartedComicStrategy,
    private readonly getNotStartedComicStrategy: GetNotStartedComicStrategy
  ) {
  }

  async getComicInfos(strategyType: string, user_id: string, category_id: number): Promise<ComicInfo[]> {
    // Em vez de chamar o banco direto aqui, delegamos para as classes do Strategy 
    let searchStrategy: SearchNotStartedStrategy; 
    if (strategyType === 'not-started') searchStrategy = this.searchNotStartedComicStrategy;
    else searchStrategy = this.searchNotStartedComicByCategoryStrategy;
    return searchStrategy.search(user_id, category_id);
  }

  async getComic(strategy: string, comic_id: number, user_id: string): Promise<GetComic> {
    let getComicStrategy: GetComicStrategy;
    if (strategy === 'started') getComicStrategy = this.getStartedComicStrategy;
    else getComicStrategy = this.getNotStartedComicStrategy;
    return getComicStrategy.get(user_id, comic_id);
  }

  async getUserComicsOnHistoric(user_id: string): Promise<StartedComicInfo[]>
  // CREATE FUNCTION public.get_user_comics_on_historic(user_id uuid) 
  // RETURNS TABLE(
  //   id integer,
  //   image_url text, 
  //   first boolean,
  //   second boolean,
  //   third boolean,
  //   fourth boolean
  // )
  // AS $$
  //   SELECT c.id, c.image_url, h.first, h.second, h.third, h.fourth
  //   FROM "Comic" AS c JOIN "Historic" AS h ON c.id = h.id_comic
  //   WHERE h.id_user = user_id;
  // $$ LANGUAGE sql;
  {
    const { data, error } = await this.supabase.getInstance().rpc("get_user_comics_on_historic",{user_id: user_id});
    if(error) throw new Error(error.message);
    return data;
  }

  async getBothUrlImages(comic_id: number, index: number): Promise<{uncolored_image_url: string, colored_image_url: string}> {
    const { data, error } = await this.supabase.getInstance().from('Image').select("uncolored_image_url, colored_image_url").match({id_comic: comic_id, enum: index}).single();
    if(error) throw new Error(error.message);
    return data;
  }

  async insertComic(createComicDto: CreateComicDto): Promise<number> {
    const { error } = await this.supabase.getInstance().from('Historic').insert({id_user: createComicDto.user_id, id_comic: createComicDto.comic_id, first: true});
    if(error) throw new Error(error.message);
    return 200;
  }

  //STRATEGY
  async updateComic(updateComicDto: UpdateComicDto): Promise<number> {
    let updateStrategy: UpdateStrategy;
    if(updateComicDto.index === 'first') updateStrategy = this.firstUpdateStrategy;
    else if (updateComicDto.index === 'second') updateStrategy = this.secondUpdateStrategy; 
    else if (updateComicDto.index === 'third') updateStrategy = this.thirdUpdateStrategy; 
    else updateStrategy = this.fourthUpdateStrategy; 
    const status = await updateStrategy.update(updateComicDto.user_id, updateComicDto.comic_id);
    return status;
  }
}