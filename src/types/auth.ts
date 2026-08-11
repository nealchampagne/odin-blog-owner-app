import type { User } from "./user.js";

export type LoginResponse = {
  user: User;
  token: string;
};