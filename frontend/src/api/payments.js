import api from "./config";

const paymentsAPI = {
  // Create payment intent
  createIntent: async (orderId) => {
    const response = await api.post(`/payments/${orderId}/intent`);
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (orderId, paymentIntentId) => {
    const response = await api.post("/payments/confirm", {
      orderId,
      paymentIntentId,
    });
    return response.data;
  },

  // Get payment history
  getHistory: async (orderId) => {
    const response = await api.get(`/payments/${orderId}/history`);
    return response.data;
  },
};

export default paymentsAPI;

