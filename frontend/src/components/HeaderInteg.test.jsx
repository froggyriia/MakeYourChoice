import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: () => ({
    logout: vi.fn(),
    email: 'student@example.com',
    trueRole: 'student',
    currentRole: 'student',
    setCurrentRole: vi.fn(),
  }),
}));

vi.mock('../context/CatalogueContext.jsx', () => ({
  useCatalogueContext: () => ({
    catalogue: {
      viewMode: 'compact',
      setViewMode: vi.fn(),
      courseTypeFilter: '',
      setCourseTypeFilter: vi.fn(),
      startAddingCourse: vi.fn(),
    },
    programs: {
      setShowModal: vi.fn(),
    },
    excelExport: {
      exportToExcel: vi.fn(),
      isExported: false,
    },
  }),
}));

vi.mock('../api/functions_for_users.js', () => ({
  getUserProgram: vi.fn(() => Promise.resolve('group1')),
}));

vi.mock('../api/functions_for_programs.js', () => ({
  getDeadlineForGroup: vi.fn(() => Promise.resolve(Date.now())),
}));

describe('Header Integration', () => {
  it('should render user email and search input', async () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(await screen.findByText('student@example.com')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Search courses...')).toBeInTheDocument();

    expect(screen.getByText('Log out')).toBeInTheDocument();
  });
});
