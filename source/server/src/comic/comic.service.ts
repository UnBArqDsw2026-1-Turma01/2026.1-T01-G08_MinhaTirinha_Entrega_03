import { Injectable } from '@nestjs/common';
import { SearchUnreadStrategy } from './strategy/search_unread_comic.strategy';
import { SearchUnreadByCategoryStrategy } from './strategy/search_unread_comic_by_category.strategy';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Comic } from './entities/comic.entity';
import { Image } from './entities/image.entity';
import { Status } from './entities/status.entity';
import { ComicInfo } from './entities/comic_info.entity';
import { GetComic } from './entities/get_comic.entity';
import { StartedComicInfo } from './entities/started_comic_info';


@Injectable() // O Nest garante que isso aqui é um Singleton automático por padrão
export class ComicService {
  private searchUnreadStrategy: SearchUnreadStrategy;
  private searchUnreadByCategoryStrategy: SearchUnreadByCategoryStrategy;

  constructor(private readonly supabase: SupabaseService) {
    this.searchUnreadStrategy = new SearchUnreadStrategy(supabase.getInstance());
    this.searchUnreadByCategoryStrategy = new SearchUnreadByCategoryStrategy(supabase.getInstance());
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
  
  // CREATE FUNCTION public.get_comic(comic_id integer)
  // RETURNS TABLE(
  //    id integer,
  //    name text
  // ) 
  // AS $$
  //   SELECT comic.id, comic.name
  //   FROM "Comic" AS comic
  //   WHERE comic.id = comic_id;
  // $$ LANGUAGE sql;
  
    const { data, error } = await this.supabase.getInstance().rpc("get_comic",{comic_id: comic_id});
    if(error) throw new Error(error.message);
    return data;
  }

  private async getComicUncoloredImages(comic_id: number): Promise<Image[]>
  /**
   * Retorna um array de imagens não coloridas de uma comic.
   */

  // CREATE FUNCTION public.get_comic_uncolored_images(comic_id integer)
  // RETURNS TABLE(
  //   enum integer,
  //   image_url text
  // )
  // AS $$ 
  //   SELECT image.enum, image.uncolored_image_url AS image_url
  //   FROM "Image" AS image    
  //   WHERE image.id_comic = comic_id
  //   ORDER BY image.enum asc;
  // $$ LANGUAGE sql;
  {
    const { data, error } = await this.supabase.getInstance().rpc("get_comic_uncolored_images", {comic_id: comic_id});
    if(error) throw new Error(error.message);
    return data;
  }

  async getNotStartedComic(comic_id: number): Promise<GetComic>
  {
    const comic_info = await this.getComic(comic_id);
    const  comic_images = await this.getComicUncoloredImages(comic_id);
    const comic_status: Status = {first: false, second: false, third: false, fourth: false};
    return {comic_info, comic_images, comic_status};
  }

  private async getUserComicStatusOnHistoric(user_id: string, comic_id: number): Promise<Status>
  // CREATE FUNCTION public.get_user_comic_status_on_historic(user_id uuid, comic_id integer) 
  // RETURNS TABLE(
  //   first boolean,
  //   second boolean,
  //   third boolean,
  //   fourth boolean
  // ) 
  // AS $$
  //   SELECT historic.first, historic.second, historic.third, historic.fourth
  //   FROM "Historic" AS historic
  //   WHERE (historic.id_user = user_id) AND (historic.id_comic = comic_id); 
  // $$ LANGUAGE sql;
  {
    const { data, error } = await this.supabase.getInstance().rpc('get_user_comic_status_on_historic', {user_id: user_id, comic_id: comic_id})
    if(error) throw new Error(error.message);
    return data;
  }

  private async getUncoloredImageUrl(comic_id: number, index: number) : Promise<Image>
  // CREATE FUNCTION public.get_uncolored_image_url(comic_id integer, index integer) 
  // RETURNS TABLE(
  //   enum integer,
  //   image_url text
  // ) 
  // AS $$
  //   SELECT image.enum, image.uncolored_image_url
  //   FROM "Image" AS image
  //   WHERE (image.id_comic = comic_id) AND (image.enum = index);
  // $$ LANGUAGE sql;
  {
    const { data, error } = await this.supabase.getInstance().rpc('get_uncolored_image_url', {comic_id: comic_id, index: index})
    if(error) throw new Error(error.message);
    return data;
  }

  private async getColoredImageUrl(comic_id: number, index: number): Promise<Image>
  // CREATE FUNCTION public.get_colored_image_url(comic_id integer, index integer) 
  // RETURNS TABLE(
  //   enum integer,
  //   image_url text
  // ) 
  // AS $$
  //   SELECT image.enum, image.colored_image_url
  //   FROM "Image" AS image
  //   WHERE (image.id_comic = comic_id) AND (image.enum = index);
  // $$ LANGUAGE sql;
  {
    const { data, error } = await this.supabase.getInstance().rpc('get_colored_image_url', {comic_id: comic_id, index: index})
    if(error) throw new Error(error.message);
    return data;
  }

  async getUserComic(user_id: string, comic_id: number): Promise<GetComic> {
    const comic_info = await this.getComic(comic_id);
    let comic_status = await this.getUserComicStatusOnHistoric(user_id, comic_id);
    comic_status = comic_status[0];

    
    let firstImage: Image, secondImage: Image, thirdImage: Image, fourthImage: Image;

    if(comic_status.first) firstImage = await this.getColoredImageUrl(comic_id, 1);
    else firstImage = await this.getUncoloredImageUrl(comic_id, 1);
    
    if(comic_status.second) secondImage = await this.getColoredImageUrl(comic_id, 2);
    else secondImage = await this.getUncoloredImageUrl(comic_id, 2);
    
    if(comic_status.third) thirdImage = await this.getColoredImageUrl(comic_id, 3);
    else thirdImage = await this.getUncoloredImageUrl(comic_id, 3);
    
    if(comic_status.fourth) fourthImage = await this.getColoredImageUrl(comic_id, 4);
    else fourthImage = await this.getUncoloredImageUrl(comic_id, 4);

    const comic_images: Image[] = [firstImage[0], secondImage[0], thirdImage[0], fourthImage[0]];

    return {comic_info, comic_images, comic_status};
  }

  async getUserComicsOnHistoric(user_id: string): Promise<StartedComicInfo[]>
  {
    const { data, error } = await this.supabase.getInstance().rpc("get_user_comics_on_historic",{user_id: user_id});
    if(error) throw new Error(error.message);
    return data;
  }
}