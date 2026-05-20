import { getGalleryComicsByUser } from "../lib/started-comics";

// Lightweight Services shim used by the app when a real backend SDK isn't available.
// Implements the minimal methods expected by the UI: getUnreadComics, getUnreadComicsByCategory, getCategories.

export const Services = {
  async getUnreadComics(userId: string | undefined) {
    // returns array of { id, title, image_url }
    return Promise.resolve(getGalleryComicsByUser(userId));
  },

  async getUnreadComicsByCategory(userId: string | undefined, categoryId: number) {
    // For the shim, ignore category filter and return all unread comics for the user.
    return Promise.resolve(getGalleryComicsByUser(userId));
  },

  async getCategories() {
    // Return some default categories for the UI. In a real backend, replace with API call.
    return Promise.resolve([
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
      { id: 3, name: "Category 3" },
      { id: 4, name: "Category 4" },
      { id: 5, name: "Category 5" },
    ]);
  },
};
