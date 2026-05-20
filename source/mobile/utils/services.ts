export class Services {

    private static url: string = "http://192.168.1.9:3000/";
    private static timeoutMs: number = 3500;

    private static async getData(route: string): Promise<any> {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

        try {
            const response = await fetch(`${this.url}${route}`, {
                signal: controller.signal,
            });
            
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch {
            return undefined;
        } finally {
            clearTimeout(timeout);
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

    static async getStartedComics(user_id: string) {
        return this.getData(`historic/in-progress/${user_id}`);
    }
}
