import axios from "axios";


export const BASE_URL = "http://localhost:5000"; // 👈 backend port
export const clientServer = axios.create({
  baseURL: BASE_URL, // 👈 backend port
  withCredentials: true,
});
