import api from "../api";

interface ShippingDetails {
  name: string;
  address: string;
  phone: string;
  city: string;
  postcode: string;
}

export const createPayment = async (
  orderId: string,
  shippingDetails: ShippingDetails
) => {
  try {
    const res = await api.post("/payments", {
      orderId,
      shippingDetails,
    });

    if (!res.data || !res.data.GatewayPageURL) {
      throw new Error("Invalid payment response");
    }

    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Please login to continue");
    }
    throw new Error(
      error.response?.data?.message || "Payment initiation failed"
    );
  }
};
