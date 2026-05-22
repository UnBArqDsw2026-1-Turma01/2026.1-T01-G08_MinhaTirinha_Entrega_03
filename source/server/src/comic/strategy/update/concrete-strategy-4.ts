import { SupabaseService } from "src/supabase/supabase.service";
import { UpdateStrategy } from "./strategy";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FourthUpdateStrategy extends UpdateStrategy {
    
    constructor(private readonly supabase: SupabaseService){
        super();
    }
        
    async update(user_id:string, comic_id: number): Promise<number> {
        const { error } = await this.supabase.getInstance().from('Historic').update({fourth: true}).match({id_user: user_id, id_comic: comic_id});
        if(error) throw new Error(error.message);
        return 200;
    }

}