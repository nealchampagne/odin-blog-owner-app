import { render, screen, fireEvent, within, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PostDetail from "../../src/pages/PostDetail.tsx";
import * as postsApi from "../../src/api/posts.js";
import * as commentsApi from "../../src/api/comments.js";

import type { Post } from "../../src/types/post.js";
import type { Comment } from "../../src/types/comment.js";
import type { PaginatedResponse } from "../../src/types/pagination.js";
import type { User } from "../../src/types/user.js";

vi.stubGlobal("confirm", vi.fn(() => true));

const fakeUser: User = {
  id: "user-123",
  name: "John",
  email: "johndoe@example.com",
  role: "USER",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

beforeEach(() => {
  localStorage.setItem("user", JSON.stringify(fakeUser));
});

afterEach(() => {
  localStorage.clear();
});

const makePost = (overrides: Partial<Post> = {}): Post => ({
  id: "1",
  title: "Test Post",
  content: "Hello **Markdown**",
  published: true,
  authorId: "user-123",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  publishedAt: new Date().toISOString(),
  _count: { comments: 0 },
  ...overrides,
});

const makeComment = (overrides: Partial<Comment> = {}): Comment => ({
  id: "c1",
  content: "Nice post!",
  postId: "1",
  authorId: "user-123",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  author: fakeUser,
  ...overrides,
});

const makeCommentsResponse = (
  comments: Comment[],
  totalPages = 1
): PaginatedResponse<Comment> => ({
  data: comments,
  page: 1,
  pageSize: 10,
  total: comments.length,
  totalPages,
});

const renderWithRouter = (ui: React.ReactElement, path = "/posts/1") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/posts/:id" element={ui} />
      </Routes>
    </MemoryRouter>
  );

describe("PostDetail page", () => {
  it("shows loading state initially", () => {
    vi.spyOn(postsApi, "getPost").mockImplementation(() => new Promise(() => {}));
    renderWithRouter(<PostDetail />);
    expect(screen.getByText(/loading…/i)).toBeInTheDocument();
  });

  it("shows error state when getPost fails", async () => {
    vi.spyOn(postsApi, "getPost").mockRejectedValue(new Error("fail"));
    renderWithRouter(<PostDetail />);
    expect(await screen.findByText(/post not found/i)).toBeInTheDocument();
  });

  it("shows not found when post is null", async () => {
    vi.spyOn(postsApi, "getPost").mockResolvedValue(null);
    renderWithRouter(<PostDetail />);
    expect(await screen.findByText(/post not found/i)).toBeInTheDocument();
  });

  it("renders post and comments", async () => {
    vi.spyOn(postsApi, "getPost").mockResolvedValue(makePost());
    vi.spyOn(commentsApi, "getCommentsForPost").mockResolvedValue(makeCommentsResponse([makeComment()]));

    renderWithRouter(<PostDetail />);
    expect(await screen.findByRole("heading", { name: /test post/i })).toBeInTheDocument();
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
    expect(screen.getByText(/markdown/i)).toBeInTheDocument();
    expect(screen.getByText(/nice post/i)).toBeInTheDocument();
  });

  it("allows adding a comment", async () => {
    vi.spyOn(postsApi, "getPost").mockResolvedValue(makePost());
    vi.spyOn(commentsApi, "getCommentsForPost").mockResolvedValue(makeCommentsResponse([]));
    const mockCreate = vi.spyOn(commentsApi, "createComment")
      .mockResolvedValue(makeComment({ id: "c2", content: "New comment" }));

    renderWithRouter(<PostDetail />);
    const textarea = await screen.findByPlaceholderText(/write a comment/i);
    fireEvent.change(textarea, { target: { value: "New comment" } });
    await act(async () => {
      fireEvent.click(screen.getByText(/add comment/i));
    });

    expect(mockCreate).toHaveBeenCalledWith("1", { content: "New comment" });
  });

  it("allows deleting a comment", async () => {
    vi.spyOn(postsApi, "getPost").mockResolvedValue(makePost());
    vi.spyOn(commentsApi, "getCommentsForPost").mockResolvedValue(makeCommentsResponse([makeComment()]));
    const mockDelete = vi.spyOn(commentsApi, "deleteComment").mockResolvedValue({ success: true });

    renderWithRouter(<PostDetail />);
    const commentCard = await screen.findByTestId("comment-card-c1") as HTMLElement;
    const deleteButton = within(commentCard).getByRole("button", { name: /delete/i });
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(mockDelete).toHaveBeenCalledWith("1", "c1");
  });

  it("allows editing a comment", async () => {
    vi.spyOn(postsApi, "getPost").mockResolvedValue(makePost());
    vi.spyOn(commentsApi, "getCommentsForPost").mockResolvedValue(makeCommentsResponse([makeComment()]));
    const mockUpdate = vi.spyOn(commentsApi, "updateComment")
      .mockResolvedValue(makeComment({ id: "c1", content: "Edited comment" }));

    renderWithRouter(<PostDetail />);
    const commentCard = await screen.findByTestId("comment-card-c1") as HTMLElement;
    const editButton = within(commentCard).getByRole("button", { name: /^edit$/i });
    await act(async () => {
      fireEvent.click(editButton);
    });

    const textarea = within(commentCard).getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Edited comment" } });
    await act(async () => {
      fireEvent.click(screen.getByText(/save/i));
    });

    expect(mockUpdate).toHaveBeenCalledWith("1", "c1", { content: "Edited comment" });
  });

  it("allows publishing and unpublishing", async () => {
    const draftPost = makePost({ published: false });
    const publishedPost = makePost({ published: true });

    const mockGet = vi.spyOn(postsApi, "getPost");
    mockGet.mockResolvedValueOnce(draftPost); // initial load
    const mockPublish = vi.spyOn(postsApi, "publishPost").mockResolvedValue(publishedPost);
    mockGet.mockResolvedValueOnce(publishedPost); // after publish
    const mockUnpublish = vi.spyOn(postsApi, "unpublishPost").mockResolvedValue(draftPost);
    mockGet.mockResolvedValueOnce(draftPost); // after unpublish

    renderWithRouter(<PostDetail />);
    const postHeading = await screen.findByRole("heading", { name: /test post/i });
    const postActions = postHeading.nextElementSibling as HTMLElement;
    const publishButton = within(postActions).getByRole("button", { name: /publish/i });
    await act(async () => {
      fireEvent.click(publishButton);
    });
    expect(mockPublish).toHaveBeenCalledWith("1");

    const unpublishButton = within(postActions).getByRole("button", { name: /unpublish/i });
    await act(async () => {
      fireEvent.click(unpublishButton);
    });
    expect(mockUnpublish).toHaveBeenCalledWith("1");
  });

  it("allows editing the post", async () => {
    // Initial mock returns a post with title "Test Post"
    vi.spyOn(postsApi, "getPost").mockResolvedValueOnce(makePost({ title: "Test Post" }));

    const mockUpdatePost = vi.spyOn(postsApi, "updatePost")
      .mockResolvedValue(makePost({ title: "Updated Title" }));

    // After update, getPost should return the updated post
    vi.spyOn(postsApi, "getPost").mockResolvedValueOnce(makePost({ title: "Updated Title" }));

    renderWithRouter(<PostDetail />);

    // ✅ Find the original heading before editing
    const postHeading = await screen.findByRole("heading", { name: /test post/i });
    const postActions = postHeading.nextElementSibling as HTMLElement;
    const editButton = within(postActions).getByRole("button", { name: /^edit$/i });

    await act(async () => {
      fireEvent.click(editButton);
    });

    const titleInput = await screen.findByDisplayValue(/test post/i);
    fireEvent.change(titleInput, { target: { value: "Updated Title" } });

    await act(async () => {
      fireEvent.click(screen.getByText(/save/i));
    });

    expect(mockUpdatePost).toHaveBeenCalledWith("1", {
      title: "Updated Title",
      content: "Hello **Markdown**",
    });

    // ✅ Assert against the updated heading
    expect(await screen.findByRole("heading", { name: /updated title/i }))
      .toBeInTheDocument();
  });
});