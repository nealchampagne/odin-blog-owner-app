import { render, fireEvent, waitFor } from "@testing-library/react";
import CreatePost from "../../src/pages/CreatePost.tsx";
import * as postsApi from "../../src/api/posts.js";
import { useNavigate } from "react-router-dom";
import type { Mock } from "vitest";
import type { Post } from "../../src/types/post.ts";

// Mock navigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("CreatePost page", () => {
  let mockNavigate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockNavigate = vi.fn();
    (useNavigate as unknown as Mock).mockReturnValue(mockNavigate);
  });

  it("submits successfully and navigates", async () => {
    const fakePost: Post = {
      id: "1",
      title: "Hello World",
      content: "Markdown content",
      published: true,
      authorId: "user-123",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _count: { comments: 0 },
    };

    vi.spyOn(postsApi, "createPost").mockResolvedValue(fakePost);

    const { getByText } = render(<CreatePost />);

    // Simulate submit via MarkdownEditor
    const editor = getByText("Create New Post").parentElement!.querySelector("form");
    fireEvent.submit(editor!);

    await waitFor(() => {
      expect(postsApi.createPost).toHaveBeenCalledWith({
        title: expect.any(String),
        content: expect.any(String),
      });
      expect(mockNavigate).toHaveBeenCalledWith("/posts");
    });
  });


  it("shows error on failure", async () => {
    vi.spyOn(postsApi, "createPost").mockRejectedValue(new Error("fail"));

    const { getByText, findByText } = render(<CreatePost />);

    const editor = getByText("Create New Post").parentElement!.querySelector("form");
    fireEvent.submit(editor!);

    expect(await findByText("Failed to create post.")).toBeInTheDocument();
  });

  it("cancels and navigates back", () => {
    const { getByText } = render(<CreatePost />);

    // MarkdownEditor renders a cancel button wired to onCancel
    const cancelButton = getByText(/cancel/i);
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith("/posts");
  });
});