import { getPaymentSession } from "@/api/get-payment-session";
import { useQuery } from "@tanstack/react-query";

export const usePaymentSession = (sessionId: string) => {
  return useQuery({
    queryFn: () => getPaymentSession(sessionId),
    queryKey: ["payment", sessionId],
  });
};
