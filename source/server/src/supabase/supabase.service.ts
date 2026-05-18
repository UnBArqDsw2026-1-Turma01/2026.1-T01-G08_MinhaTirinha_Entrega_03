import { Injectable } from '@nestjs/common';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

import ws from 'ws';

@Injectable()
export class SupabaseService {

  private supabase: SupabaseClient;

  constructor() {

    this.supabase = createClient(

      process.env.SUPABASE_URL!,

      process.env.SUPABASE_SERVICE_ROLE_KEY!,

      {
        realtime: {
          transport: ws,
        },
      },
    );
  }

  getInstance(): SupabaseClient {
    return this.supabase;
  }
}