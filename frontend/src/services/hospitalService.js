import api from "./api";

export const searchHospitals = async (query) => {
  const response = await api.get(`/hospitals/search?query=${query}`);
  return response.data;
};