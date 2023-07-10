import storage from "@/utils/storage";

export const logout = async () => {
  storage.clear("token");

  //   window.location.assign(window.location.origin as unknown as string);
};
