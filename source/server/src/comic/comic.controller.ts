import { Controller, Get, Param } from '@nestjs/common';
import { ComicService } from './comic.service';
import { Comic } from './entities/comic.entity';
import { UncoloredImage } from './entities/uncoloredImage.entity';
import { Status } from './entities/status.entity';

@Controller()
export class ComicController {
  constructor(private readonly comicService: ComicService) {}

  @Get('comics/not-started/:userId')
  async getNotStartedComics(@Param('userId') userId: string)
  /**
  * GET Tirinhas não inicializadas pelo usuário. 
  */ 
  {
    return this.comicService.findByStrategy('unread', userId);
  }

  @Get('comics/not-started/:userId/category/:categoryId')
  async getNotStartedComicsByCategory(@Param('userId') userId: string, @Param('categoryId') categoryId: number)
  /**
  * GET Tirinhas não inicializadas pelo usuário ordenadas por categoria. 
  */ 
  {
    return this.comicService.findByStrategy('category', userId, categoryId);
  }

  @Get('comic/not-started/:comic_id')
  getNotStartedComic(@Param('comic_id') comic_id: number): Promise<{comic_info: Comic, uncolored_comic_images: UncoloredImage[], status: Status}> 
  /**
  * GET Tirinha não inicializada pelo usuário. 
  */ 
  {
    return this.comicService.getNotStartedComic(comic_id);
  }

}