export class Services {

    private static url: string = "http://192.168.1.9:3000/";

    private static async getData(route: string): Promise<any> {
        try {
            const response = await fetch(`${this.url}${route}`);
            
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error: any) {
            console.error(error.message);
        }
    }
    static async getUnreadComics(user_id: string) {
        return this.getData(`comic/unread-comics/${user_id}`);
    }

    static async getUnreadComicsByCategory(user_id: string, category_id: number) {
        return this.getData(`comic/unread-comics/${user_id}/${category_id}`);
    }

    static async getCategories() {
        return this.getData('category/get-all');
    }
}