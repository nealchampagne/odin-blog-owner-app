import api from "./client";

export const getDashboardStats = () =>
  api<{
    totalPosts: number;
    draftPosts: number;
    publishedPosts: number;
    totalComments: number;
    totalUsers: number;
  }>("/posts/stats", { method: "GET" });