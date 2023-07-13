import { getCurrentLocation } from "@/api/get-current-location";
import { useQuery } from "@tanstack/react-query";

export const useCurrentLocation = (lat: number, long: number, hasLocation: boolean) => {
  return useQuery({
    queryFn: () => getCurrentLocation(lat, long),
    queryKey: ["location", lat, long],
    enabled: hasLocation,
  });
};
