import axiosInstance from "./axiosInstance";

export const loginUser = async (payload) => {
  const { data } = await axiosInstance.post("auth/login", payload);
  return data;
};

export const registerUser = async (payload) => {
  const { data } = await axiosInstance.post("/api/auth/register", payload);
  return data;
};
