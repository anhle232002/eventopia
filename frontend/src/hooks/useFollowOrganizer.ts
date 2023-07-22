import { axios } from "@/libs/axios";
import { queryClient } from "@/libs/query-client";
import { useMutation } from "@tanstack/react-query";

export const useFollowOrganizer = () => {
  return useMutation({
    mutationFn: async ({ organizerId, follow }: { organizerId: string; follow: boolean }) => {
      await axios.put(`/organizers/${organizerId}/${follow ? "follow" : "unfollow"}`);
    },
    onError() {
      console.log("Something went wrong");
    },
    onSuccess(_, variables) {
      const queryData = queryClient.getQueryData<any>(["organizer", variables.organizerId]);

      if (queryData) {
        queryData.isFollowedByYou = variables.follow;

        queryClient.setQueryData(["organizer", variables.organizerId], queryData);
      }
    },
  });
};
