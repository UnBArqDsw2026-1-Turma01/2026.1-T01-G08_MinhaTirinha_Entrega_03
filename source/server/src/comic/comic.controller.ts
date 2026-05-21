import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ComicService } from './comic.service';
import { GetComic } from './entities/get_comic.entity';
import { ComicInfo } from './entities/comic_info.entity';
import { UpdateComicDto } from './dto/update-comic.dto';
import { CreateComicDto } from './dto/create-comic.dto';


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
  getUserComicOnHistoric(@Param('user_id') user_id: string, @Param('comic_id') comic_id: number): Promise<GetComic>  {
    return this.comicService.getUserComic(user_id, comic_id);
  }

  @Get('comics/started/:user_id')
  async getUserComicsOnHistoric(@Param('user_id') user_id: string): Promise<any> {
    return this.comicService.getUserComicsOnHistoric(user_id);
  }

  @Get('comic/both-images/:comic_id/:index')
  async getBothUrlImages(@Param('comic_id') comic_id: number, @Param('index') index: number): Promise<{uncolored_image_url: string, colored_image_url: string}> {
    return this.comicService.getBothUrlImages(comic_id, index);
  }

  @Post('comic/insert')
  async insertComic(@Body() createComicDto: CreateComicDto): Promise<number> {
    return this.comicService.insertComic(createComicDto);
  }

  @Patch('comic/update')
  async updateComic(@Body() updateComicDto: UpdateComicDto) {
    return this.comicService.updateComic(updateComicDto);
  }

}