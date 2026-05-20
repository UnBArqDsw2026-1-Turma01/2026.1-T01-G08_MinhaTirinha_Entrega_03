import { Controller, Get, Param } from '@nestjs/common';
import { ComicService } from './comic.service';
import { GetComic } from './entities/get_comic.entity';
import { ComicInfo } from './entities/comic_info.entity';

@Controller()
export class ComicController {
  constructor(private readonly comicService: ComicService) {}

  @Get('comics/not-started/:userId')
  async getNotStartedComics(@Param('userId') userId: string): Promise<ComicInfo[]>
  /**
  * GET Tirinhas não inicializadas pelo usuário. 
  */ 
  {
    return this.comicService.findByStrategy('unread', userId);
  }

  @Get('comics/not-started/:userId/category/:categoryId')
  async getNotStartedComicsByCategory(@Param('userId') userId: string, @Param('categoryId') categoryId: number): Promise<ComicInfo[]>
  /**
  * GET Tirinhas não inicializadas pelo usuário ordenadas por categoria. 
  */ 
  {
    return this.comicService.findByStrategy('category', userId, categoryId);
  }

  @Get('comic/not-started/:comic_id')
  getNotStartedComic(@Param('comic_id') comic_id: number): Promise<GetComic> 
  /**
  * GET Tirinha não inicializada pelo usuário. 
  */ 
  {
    return this.comicService.getNotStartedComic(comic_id);
  }

  @Get('comic/started/:user_id/:comic_id')
  getUserComicOnHistoric(@Param('user_id') user_id: string, @Param('comic_id') comic_id: number) {
    return this.comicService.getUserComic(user_id, comic_id);
  }

}