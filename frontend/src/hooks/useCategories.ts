import { getCategories } from "@/api/get-categories";
import { useQuery } from "@tanstack/react-query";

export const useCategories = (query: { order: string }) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(query),
  });
};
