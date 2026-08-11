import type { User } from "./user.js";

export type Comment = {
  id: string;
  content: string;
  postId: string;
  author: User;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};