import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Sidebar from '../../src/components/Sidebar.jsx';

describe('Sidebar', () => {
  it('renders the title', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    expect(screen.getByText('Blog Admin App')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    const dashboardLink = screen.getByText('Dashboard');
    const postsLink = screen.getByText('Posts');

    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    expect(postsLink).toHaveAttribute('href', '/posts');
  });

  it('renders inside an aside element', () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    expect(container.querySelector('aside')).toBeTruthy();
  });
});