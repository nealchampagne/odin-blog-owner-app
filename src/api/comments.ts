import api from "./client";
import type { Comment } from "../types/comment";

const getAllComments = () =>
  api<Comment[]>("/comments");

const getCommentsForPost = (postId: string) =>
  api<Comment[]>(`/posts/${postId}/comments`);

const deleteComment = (id: string) =>
  api<{ success: boolean }>(`/comments/${id}`, {
    method: "DELETE"
  });

const createComment = (postId: string, data: { content: string }) =>
  api<Comment>(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(data)
  });

export { 
  getAllComments,
  getCommentsForPost,
  deleteComment,
  createComment
};