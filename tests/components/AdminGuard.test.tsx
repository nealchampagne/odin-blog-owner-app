import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminGuard from '../../src/components/AdminGuard.jsx';

// Hoisted mock: define the function inside the factory
vi.mock('../../src/store/auth.js', () => {
  return {
    useAuth: vi.fn(),
  };
});

// After the mock is set up, import it
import { useAuth } from '../../src/store/auth.js';
const mockedUseAuth = useAuth as unknown as ReturnType<typeof vi.fn>;

describe('AdminGuard', () => {
  beforeEach(() => {
    mockedUseAuth.mockReset();
  });

  it('renders nothing while loading', () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: true });
    const { container } = render(
      <MemoryRouter>
        <AdminGuard />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('redirects to /login when not admin', () => {
    mockedUseAuth.mockReturnValue({ user: { role: 'USER' }, loading: false });
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminGuard />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders outlet when admin', () => {
    mockedUseAuth.mockReturnValue({ user: { role: 'ADMIN' }, loading: false });
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<AdminGuard />}>
            <Route index element={<div>Admin Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });
});
