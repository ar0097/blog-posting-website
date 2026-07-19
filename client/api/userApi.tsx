import api from "./api";
import { GetUsersResponse } from "@/types/userTypes";

export const getUsers = async (): Promise<GetUsersResponse> => {
  const response = await api.get("/users");
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};
