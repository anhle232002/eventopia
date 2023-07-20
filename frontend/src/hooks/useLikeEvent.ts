import { likeEvent } from "@/api/like-event";
import { queryClient } from "@/libs/query-client";
import { useMutation } from "@tanstack/react-query";

export const useLikeEvent = () => {
  return useMutation({
    mutationFn: ({ eventId, like }: { eventId: number; like: boolean }) => likeEvent(eventId, like),
    onSuccess(data, variables) {
      const updatedLikedEvent = queryClient.getQueryData<Set<number>>(["events", "liked"]);

      if (variables.like) {
        updatedLikedEvent?.add(variables.eventId);

        queryClient.setQueryData(["events", "liked"], updatedLikedEvent);
      } else {
        updatedLikedEvent?.delete(variables.eventId);

        queryClient.setQueryData(["events", "liked"], updatedLikedEvent);
      }
    },
    onError(error) {
      console.log(error);
    },
  });
};
