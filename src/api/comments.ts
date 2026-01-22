import api from "./client";
import type { Comment } from "../types/comment";
import type { PaginatedResponse } from "../types/pagination";

const getAllComments = () =>
  api<Comment[]>("/comments");

const getAllCommentsForPost = (postId: string) =>
  api<Comment[]>(`/posts/${postId}/comments`);

const getCommentsForPost = (
  postId: string,
  page = 1,
  pageSize = 10
) =>
  api<PaginatedResponse<Comment>>(
    `/posts/${postId}/comments?page=${page}&pageSize=${pageSize}`
  );

const updateComment = (id: string, data: { content: string }) =>
  api<Comment>(`/comments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });

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
  getAllCommentsForPost,
  getCommentsForPost,
  deleteComment,
  createComment,
  updateComment
};