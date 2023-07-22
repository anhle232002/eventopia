import { axios } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetOrganizer = (organizerId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["organizer", organizerId],
    queryFn: async () => {
      const response = await axios.get(`/organizers/${organizerId}`);

      return response.data;
    },
    enabled: enabled,
  });
};
