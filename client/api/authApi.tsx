import { AdminLoginResponse } from "@/types/authType";
import api from "./api";

export const adminLogin = async (
  email: string,
  password: string,
): Promise<AdminLoginResponse> => {
  const response = await api.post<AdminLoginResponse>("/admin/login", {
    email,
    password,
  });

  return response.data;
};

export const getAdmin = async () => {
  const response = await api.get("/admin/me");
  return response.data;
};

export const googleLogin = async (credential: string) => {
  const response = await api.post("/auth/google", {
    credential,
  });

  return response.data;
};


