import { getLocations } from "@/api/get-location";
import { useQuery } from "@tanstack/react-query";

export const useLocations = (search: string) => {
  return useQuery({ queryFn: () => getLocations(search), queryKey: ["locations", search] });
};
