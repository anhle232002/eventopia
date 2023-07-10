import { axios } from "@/libs/axios";

export const getPaymentSession = async (sessionId: string) => {
  if (!sessionId) return null;

  const response = await axios.get("/payment/session", {
    params: {
      session_id: sessionId,
    },
  });

  return response.data;
};
