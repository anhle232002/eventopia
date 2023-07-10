import { updateEvent } from "@/api/update-event";
import { useMutation } from "@tanstack/react-query";

export const useUpdateEvent = () => {
  return useMutation({
    mutationFn: updateEvent,
  });
};
