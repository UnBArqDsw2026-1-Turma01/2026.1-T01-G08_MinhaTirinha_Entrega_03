import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class CategoryService {

  constructor(private readonly supabaseService: SupabaseService) {}

  async getAll(): Promise<{id: number, name: string}[]> {
    const {data, error} = await this.supabaseService.getInstance().from('Category').select();
    if(error) {
      throw new Error(error.message);
    }
    return data; 
  }
}
