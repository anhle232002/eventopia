import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 15 * 60 * 1000, retry: 1, cacheTime: 15 * 60 * 1000 } },
});
