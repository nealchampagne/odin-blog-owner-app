import { render } from "@testing-library/react";
import { vi } from "vitest";
import Root from "../src/Root.jsx";
import * as authStore from "../src/store/auth.js";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

const router = createMemoryRouter([{ path: "/", element: <div>Home</div> }]);

describe("Root component", () => {
  it("calls restore on mount", () => {
    const mockRestore = vi.fn();

    // Provide a full fake AuthState object
    const fakeAuthState = {
      user: null,
      token: null,
      loading: false,
      error: null,
      restore: mockRestore,
      login: vi.fn(),
      logout: vi.fn(),
    };

    // Mock useAuth as a selector function
    vi.spyOn(authStore, "useAuth").mockImplementation((selector) =>
      selector(fakeAuthState)
    );

    render(<Root />);
    expect(mockRestore).toHaveBeenCalled();
  });

  it("renders RouterProvider", () => {
    const fakeAuthState = {
      user: null,
      token: null,
      loading: false,
      error: null,
      restore: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
    };

    vi.spyOn(authStore, "useAuth").mockImplementation((selector) =>
      selector(fakeAuthState)
    );

    const { getByText } = render(<RouterProvider router={router} />);
    expect(getByText("Home")).toBeInTheDocument();
  });
});
