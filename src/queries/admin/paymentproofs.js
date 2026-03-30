import apiClient from "@/lib/api-client";

export const getAllPaymentProofs = async () => {
  try {
    const response = await apiClient.get("/superadmin/paymentproofs/getall");
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};

export const getPaymentProofDetail = async (id) => {
  try {
    const response = await apiClient.get(`/superadmin/paymentproof/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};

export const updatePaymentProofStatus = async ({ id, status, amount }) => {
  try {
    const response = await apiClient.put(`/superadmin/paymentproof/status/update/${id}`, { status, amount });
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};

export const deletePaymentProof = async (id) => {
  try {
    const response = await apiClient.delete(`/superadmin/paymentproof/delete/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};

export const createPaymentProof = async (payload) => {
  try {
    const response = await apiClient.post("/commission/proof", payload);
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};

export const getMyPaymentProofs = async (auctionId) => {
  try {
    const response = await apiClient.get("/commission/my-proofs", {
      params: { auctionId }
    });
    return response.data;
  } catch (err) {
    throw new Error(err);
  }
};