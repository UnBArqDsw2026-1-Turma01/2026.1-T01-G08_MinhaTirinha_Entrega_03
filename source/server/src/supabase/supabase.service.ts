import { Injectable } from '@nestjs/common';
import { SupabaseClient, GoTrueAdminApi, createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    supabase: SupabaseClient;
    adminAuthClient: GoTrueAdminApi;
    constructor() {
        this.supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
        this.adminAuthClient = this.supabase.auth.admin;
    }
}
