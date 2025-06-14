import api from "../api";
import type { User } from "../types";

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  blockUser: async (userId: string, isBlocked: boolean): Promise<void> => {
    await api.put(`/admin/users/${userId}/block`, { isBlocked });
  },

  changeRole: async (userId: string, role: string): Promise<void> => {
    await api.put(`/admin/users/${userId}/role`, { role });
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
  },
};
