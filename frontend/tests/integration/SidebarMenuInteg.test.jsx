import { vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import SidebarMenu from './SidebarMenu';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../context/AuthContext';

describe('SidebarMenu', () => {
  it('is not rendering, if role is not admin', () => {
    useAuth.mockReturnValue({ currentRole: 'user' });

    const { container } = render(
      <BrowserRouter>
        <SidebarMenu />
      </BrowserRouter>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('rendering menu with sources for admin role', () => {
    useAuth.mockReturnValue({ currentRole: 'admin' });

    render(
      <BrowserRouter>
        <SidebarMenu />
      </BrowserRouter>
    );

    expect(screen.getByText('Menu')).toBeInTheDocument();

    expect(screen.getByText('Electives (Courses)')).toHaveAttribute('href', '/admin/courses');
    expect(screen.getByText('Student Programs')).toHaveAttribute('href', '/admin/programs');
  });
});