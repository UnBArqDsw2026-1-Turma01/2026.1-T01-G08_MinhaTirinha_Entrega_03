// Essa e a interface que o flyan mencionou
export interface ComicStrategy {
  execute(supabaseClient: any, payload: any): Promise<any>;
}