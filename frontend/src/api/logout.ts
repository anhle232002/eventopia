import { axios } from "@/libs/axios";
import storage from "@/utils/storage";

export const logout = async () => {
  await axios.get("/auth/logout");

  storage.clear("token");
};
