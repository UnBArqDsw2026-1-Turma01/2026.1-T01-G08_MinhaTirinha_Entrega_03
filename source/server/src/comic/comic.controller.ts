import { Controller, Get, Param } from '@nestjs/common';
import { ComicService } from './comic.service';

@Controller('comic')
export class ComicController {
  constructor(private readonly comicService: ComicService) {}

  @Get('unread-comics/:id_user') 
  async getUnreadComics(@Param('id_user') id_user: string): Promise<{id: number, name: string, image_url: string}[]> {
    return this.comicService.getUnreadComics(id_user);
  }

  @Get('unread-comics-by-category/:id_user/:id_category')
  async getUnreadComicsByCategory(@Param('id_user') id_user: string,  @Param('id_category')id_category: number) {
    return this.comicService.getUnreadComicsByCategory(id_user, id_category);
  }
}
