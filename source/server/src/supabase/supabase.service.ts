import { Injectable } from '@nestjs/common';
import { CreateSupabaseDto } from './dto/create-supabase.dto';
import { UpdateSupabaseDto } from './dto/update-supabase.dto';
import { SupabaseClient, createClient } from '@supabase/supabase-js'


@Injectable()
export class SupabaseService {
  private supabaseClient: SupabaseClient|null = null;
  private flag: boolean = false;
  // Create a single supabase client for interacting with your database
  // Singleton
  public getInstance(): SupabaseClient {
    if(!this.flag) {
      try {
        this.supabaseClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
        this.flag = true;}
      catch(error: any) {
        throw new Error(error.message);
      } 
    } 
    return this.supabaseClient!;
  }
}
