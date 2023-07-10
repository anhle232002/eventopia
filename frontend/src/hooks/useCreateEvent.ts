import { createEvent } from "@/api/create-event";
import { useMutation } from "@tanstack/react-query";

export const useCreateEvent = () => {
  return useMutation({
    mutationFn: createEvent,
  });
};
