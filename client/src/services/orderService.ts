import api from "../api";

export const createOrder = async (bikeId: string) => {
  try {
    const res = await api.post("/orders", { bike: bikeId });
    if (!res.data || !res.data._id) {
      throw new Error("Invalid order response");
    }
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Please login to continue");
    }
    throw new Error(error.response?.data?.message || "Failed to create order");
  }
};
