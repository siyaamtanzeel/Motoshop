import api from "../api";
import type { News } from "../types";

export const newsService = {
  getAllNews: async (): Promise<News[]> => {
    const response = await api.get("/news");
    return response.data;
  },

  getNewsById: async (id: string): Promise<News> => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  createNews: async (formData: FormData): Promise<News> => {
    const response = await api.post("/news", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateNews: async (id: string, formData: FormData): Promise<News> => {
    const response = await api.put(`/news/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteNews: async (id: string): Promise<void> => {
    await api.delete(`/news/${id}`);
  },

  togglePublish: async (id: string, isPublished: boolean): Promise<News> => {
    const response = await api.put(`/news/${id}/publish`, { isPublished });
    return response.data;
  },
};

export type { News };
