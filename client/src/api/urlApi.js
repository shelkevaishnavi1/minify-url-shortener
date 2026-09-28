import axiosClient from "./axiosClient";

export const shortenUrl = async (longUrl) => {
  const response = await axiosClient.post("/url", {
    longUrl,
  });

  return response.data;
};
