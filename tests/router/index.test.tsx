import { render, screen, fireEvent } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { router } from "../../src/router/index.tsx";

vi.mock("../../src/store/auth.js", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../../src/store/auth.js";
const mockedUseAuth = useAuth as unknown as ReturnType<typeof vi.fn>;

describe("App router", () => {
  beforeEach(() => {
    mockedUseAuth.mockReset();
  });

  it("renders login page at /login", async () => {
    mockedUseAuth.mockReturnValue({
      login: vi.fn(),
      loading: false,
      error: null,
      user: null,
    });

    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ["/login"],
    });
    render(<RouterProvider router={testRouter} />);

    expect(await screen.findByRole("heading", { name: /admin login/i }))
      .toBeInTheDocument();
  });

  it("redirects to dashboard after successful login", async () => {
    const fakeLogin = vi.fn().mockResolvedValue(undefined);
    mockedUseAuth.mockReturnValue({
      login: fakeLogin,
      loading: false,
      error: null,
      user: null,
    });

    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ["/login"],
    });
    render(<RouterProvider router={testRouter} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // After login resolves, router should navigate to dashboard
    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
  });
});