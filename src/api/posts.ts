import api from "./client";
import type { Post, CreatePostPayload, UpdatePostPayload } from "../types/post";
import type { PaginatedResponse } from "../types/pagination";

const getPosts = (page = 1, pageSize = 10) => 
  api<PaginatedResponse<Post>>(`/posts?page=${page}&pageSize=${pageSize}`);

const getPost = (id: string) => api<Post>(`/posts/${id}`);

const createPost = (data: CreatePostPayload) =>
  api<Post>("/posts", {
    method: "POST",
    body: JSON.stringify(data)
  });

const updatePost = (
  id: string, 
  data: UpdatePostPayload) =>
    api<Post>(`/posts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data)
    }) as Promise<Post>;

const deletePost = (id: string) =>
  api<Post>(`/posts/${id}`, {
    method: "DELETE"
  });

const publishPost = (id: string) =>
  api<Post>(`/posts/${id}/publish`, {
    method: "PUT"
  });

const unpublishPost = (id: string) =>
  api<Post>(`/posts/${id}/unpublish`, {
    method: "PUT"
  });

export { 
  getPosts, 
  getPost, 
  createPost, 
  updatePost, 
  deletePost,
  publishPost,
  unpublishPost
};