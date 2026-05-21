import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/not-read/:user_id') 
  getNotRead(@Param('user_id') user_id: string): Promise<Category[]> 
  /**
   * GET todas as categorias.
   */
  {
    return this.categoryService.getNotRead(user_id);
  }
}
