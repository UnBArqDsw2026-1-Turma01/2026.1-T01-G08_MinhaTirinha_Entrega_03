import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ComicService } from './comic.service';
import { GetComic } from './entities/get_comic.entity';
import { ComicInfo } from './entities/comic_info.entity';
import { UpdateComicDto } from './dto/update-comic.dto';
import { CreateComicDto } from './dto/create-comic.dto';
import { StartedComicInfo } from './entities/started_comic_info';

@Controller()
export class ComicController {
  constructor(private readonly comicService: ComicService) {}

  @Get('comics/not-started/:userId')
  async getNotStartedComics(@Param('userId') userId: string): Promise<ComicInfo[]>
  /**
  * GET Tirinhas não inicializadas pelo usuário. 
  */ 
  {
    return this.comicService.getComicInfos('not-started', userId, 0);
  }

  @Get('comics/not-started/:userId/category/:categoryId')
  async getNotStartedComicsByCategory(@Param('userId') userId: string, @Param('categoryId') categoryId: number): Promise<ComicInfo[]>
  /**
  * GET Tirinhas não inicializadas pelo usuário ordenadas por categoria. 
  */ 
  {
    return this.comicService.getComicInfos('category', userId, categoryId);
  }

  @Get('comic/not-started/:comic_id')
  async getNotStartedComic(@Param('comic_id') comic_id: number): Promise<GetComic> 
  /**
  * GET Tirinha não inicializada pelo usuário. 
  */ 
  {
    return this.comicService.getComic('not-started', comic_id, '');
  }

  @Get('comic/started/:user_id/:comic_id')
  async getUserComicOnHistoric(@Param('user_id') user_id: string, @Param('comic_id') comic_id: number): Promise<GetComic>  {
    return this.comicService.getComic('started', comic_id, user_id);
  }

  @Get('comics/started/:user_id')
  async getUserComicsOnHistoric(@Param('user_id') user_id: string): Promise<StartedComicInfo[]> {
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
  async updateComic(@Body() updateComicDto: UpdateComicDto): Promise<number> {
    return this.comicService.updateComic(updateComicDto);
  }

}