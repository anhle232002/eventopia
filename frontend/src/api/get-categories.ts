import { axios } from "@/libs/axios";

export const getCategories = async ({ order = "" }: { order: string }) => {
  const response = await axios.get("/categories", {
    params: {
      order,
    },
  });

  return response.data;
};
