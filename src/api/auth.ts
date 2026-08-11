import api from "./client.js";
import type { LoginResponse } from "../types/auth.js";

const loginRequest = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  return api<LoginResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
  });
};

export default loginRequest;