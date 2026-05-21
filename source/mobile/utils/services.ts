import { ICategory } from "./entities/category.entity";
import { IComicInfo } from "./entities/comic_info.entity";
import { ICreateComic } from "./entities/create-comic.entity";
import { IGetComic } from "./entities/get_comic.entity";
import { IStartedComicInfo } from "./entities/started_comic_info";
import { IUpdateComic } from "./entities/update-comic";

export class Services {

    private static url: string = "http://192.168.1.9:3000/";

    private static async patchData(route: string, body: any): Promise<any> {
        try {
            const response = await fetch(`${this.url}${route}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }            
            return response;
        } catch {
            return undefined;
        }
    }

    private static async postData(route: string, body: any): Promise<any> {
        try {
            const response = await fetch(`${this.url}${route}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            return response;
        } catch {
            return undefined;
        }
    }

    private static async getData(route: string): Promise<any> {
        try {
            const response = await fetch(`${this.url}${route}`);
            
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch {
            return undefined;
        }
    }

    static async getNotStartedComics(user_id: string): Promise<IComicInfo[]> {
        return this.getData(`comics/not-started/${user_id}`);
    }

    static async getNotStartedComicsByCategory(user_id: string, category_id: number): Promise<IComicInfo[]> {
        return this.getData(`comics/not-started/${user_id}/category/${category_id}`);
    }

    static async getNotReadCategories(user_id: string): Promise<ICategory[]> {
        return this.getData(`category/not-read/${user_id}`);
    }

    static async getNotStartedComic(comic_id: number): Promise<IGetComic> {
        return this.getData(`comic/not-started/${comic_id}`);
    }
    
    static async getUserComicOnHistoric(user_id: string, comic_id: number): Promise<IGetComic> {
        return this.getData(`comic/started/${user_id}/${comic_id}`);
    }

    static async getUserComicsOnHistoric(user_id: string): Promise<IStartedComicInfo[]> {
        return this.getData(`comics/started/${user_id}`);
    }

    static async getBothUrlImages(comic_id: number, index: number): Promise<{uncolored_image_url: string, colored_image_url: string}> {
        return this.getData(`comic/both-images/${comic_id}/${index}`);
    }

    static async insertComic(user_id: string, comic_id: number): Promise<number> {
        const body: ICreateComic = {
            user_id: user_id,
            comic_id: comic_id
        }
        return this.postData('comic/insert/', body);
    }

    static async updateComic(user_id: string, comic_id: number, status: string): Promise<number> {
        const body: IUpdateComic = {
            user_id: user_id,
            comic_id: comic_id,
            index: status
        }
        return this.patchData('comic/update', body);
    }
}

