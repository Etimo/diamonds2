import axios from "axios";

export const client = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 9000,
  headers: { accept: "application/json" }
});
