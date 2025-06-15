import api from "../api";
import type { News } from "../types";

export const newsService = {
  getAllNews: async (): Promise<News[]> => {
    try {
      const response = await api.get("/news");
      return response.data;
    } catch (error) {
      console.error("Error fetching news:", error);
      throw error;
    }
  },

  getNewsById: async (id: string): Promise<News> => {
    try {
      const response = await api.get(`/news/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching news by id:", error);
      throw error;
    }
  },

  createNews: async (formData: FormData): Promise<News> => {
    try {
      // Log form data for debugging
      console.log("Sending form data:", Object.fromEntries(formData.entries()));

      const response = await api.post("/news", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error creating news:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to create news");
    }
  },

  updateNews: async (id: string, formData: FormData): Promise<News> => {
    try {
      const response = await api.put(`/news/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error updating news:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to update news");
    }
  },

  deleteNews: async (id: string): Promise<void> => {
    try {
      await api.delete(`/news/${id}`);
    } catch (error: any) {
      console.error("Error deleting news:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to delete news");
    }
  },

  togglePublish: async (id: string, isPublished: boolean): Promise<News> => {
    try {
      const response = await api.put(`/news/${id}/publish`, { isPublished });
      return response.data;
    } catch (error: any) {
      console.error("Error toggling news publish state:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to toggle news publish state");
    }
  },
};

export type { News };
