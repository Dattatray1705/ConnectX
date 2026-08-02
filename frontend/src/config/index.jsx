import axios from "axios";

export const clientServer = axios.create({
  baseURL: "https://connectx-backend-888g.onrender.com",
  withCredentials: true,
});