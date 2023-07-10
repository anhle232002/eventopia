import { axios } from "@/libs/axios";

export type RegisterOrganizerDto = {
  name: string;
  email: string;
  phoneNumber: string;
  description: string;
  picture: File;
};

export const registerOrganizer = async (params: RegisterOrganizerDto) => {
  const formdata = new FormData();

  Object.getOwnPropertyNames(params).forEach((p) => {
    formdata.append(p, params[p as keyof RegisterOrganizerDto]);
  });

  const response = await axios.post("/organizers", formdata);

  return response;
};
