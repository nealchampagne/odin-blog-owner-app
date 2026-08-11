import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PostsList from "../../src/pages/PostsList.tsx";
import * as postsApi from "../../src/api/posts.js";
import type { Post } from "../../src/types/post.js";
import type { PaginatedResponse } from "../../src/types/pagination.js";

const makePost = (overrides: Partial<Post> = {}): Post => ({
  id: "1",
  title: "First Post",
  content: "Hello world",
  published: true,
  authorId: "user-123",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  publishedAt: new Date().toISOString(),
  _count: { comments: 0 },
  ...overrides,
});

beforeEach(() => {
  vi.stubGlobal("confirm", vi.fn(() => true)); // ensure confirm returns true
});

describe("PostsList page", () => {
  it("calls deletePost when delete button clicked", async () => {
    vi.spyOn(postsApi, "getPosts").mockResolvedValue({
      data: [makePost()],
      page: 1,
      pageSize: 10,
      total: 1,
      totalPages: 1,
    } as PaginatedResponse<Post>);
    const mockDelete = vi.spyOn(postsApi, "deletePost").mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <PostsList />
      </MemoryRouter>
    );

    const deleteButton = await screen.findByRole("button", { name: /delete/i });

    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(mockDelete).toHaveBeenCalledWith("1");
  });
});