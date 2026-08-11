import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EmptyState from "../../src/components/EmptyState.tsx";

describe("EmptyState component", () => {
  it("renders title and message", () => {
    const { getByText } = render(
      <EmptyState title="No posts" message="There are no posts yet." />,
      { wrapper: MemoryRouter }
    );

    expect(getByText("No posts")).toBeInTheDocument();
    expect(getByText("There are no posts yet.")).toBeInTheDocument();
  });

  it("renders action link when props provided", () => {
    const { getByText } = render(
      <EmptyState
        title="Empty"
        message="Nothing here"
        actionLabel="Create one"
        actionTo="/create"
      />,
      { wrapper: MemoryRouter }
    );

    const link = getByText("Create one");
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("/create");
  });

  it("does not render link if action props missing", () => {
    const { queryByRole } = render(
      <EmptyState title="Empty" message="Nothing here" />,
      { wrapper: MemoryRouter }
    );

    expect(queryByRole("link")).toBeNull();
  });
});