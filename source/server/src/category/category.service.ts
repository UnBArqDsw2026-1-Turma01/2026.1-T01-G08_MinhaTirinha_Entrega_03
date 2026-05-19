import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CategoryService {

  constructor(
    private readonly supabaseService: SupabaseService
  ) {}

  async getCategories() {

    const supabase =
      this.supabaseService.getInstance();

    const { data, error } =
      await supabase
        .from('Category')
        .select('*');

    if (error) {
      throw error;
    }

    return data;
  }
}