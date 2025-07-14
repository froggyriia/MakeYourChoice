import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import { CatalogueProvider } from '../../src/context/CatalogueContext';
import Header from '../../src/components/Header';

// Import the mocked function so we can reference it in tests
import * as searchApi from '../../src/api/function_for_search';

// Mock API functions
vi.mock('../../src/api/functions_for_users', () => ({
  getUserProgram: vi.fn().mockResolvedValue('B24-DSAI'),
  getUserYear: vi.fn().mockResolvedValue('2'),
  getPrioritiesNumber: vi.fn().mockResolvedValue({ tech: 5, hum: 5 }),
}));

vi.mock('../../src/api/functions_for_programs', () => ({
  getDeadlineForGroup: vi.fn().mockResolvedValue('2024-06-30T23:59:59Z'),
}));

vi.mock('../../src/api/function_for_search', () => ({
  searchCoursesByTitle: vi.fn().mockResolvedValue([]),
}));

vi.mock('../../src/hooks/useExcelExport', () => ({
  useExcelExport: () => ({
    isExported: false,
    exportToExcel: vi.fn(),
  }),
}));

describe('Header Component Integration Tests', () => {
  const renderHeaderWithProviders = (role = 'student', trueRole = role) => {
    // Set localStorage before rendering
    localStorage.setItem('email', 'test@innopolis.university');
    localStorage.setItem('currentRole', role);
    localStorage.setItem('trueRole', trueRole);

    return render(
      <MemoryRouter>
        <AuthProvider>
          <CatalogueProvider>
            <Header />
          </CatalogueProvider>
        </AuthProvider>
      </MemoryRouter>
    );
  };

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render user email and dropdown menu', async () => {
    renderHeaderWithProviders('student');

    // Check email is displayed
    expect(await screen.findByText('test@innopolis.university')).toBeInTheDocument();

    // Find and click the menu button
    const menuButton = screen.getByRole('button', { name: /▾/ });
    fireEvent.click(menuButton);

    // Check menu contains logout option
    await waitFor(() => {
      expect(screen.getByText(/Log out/i)).toBeInTheDocument();
    });
  });

  it('should show deadline for student role', async () => {
    renderHeaderWithProviders('student');

    // Check deadline is displayed
    await waitFor(() => {
      expect(screen.getByText(/Deadline:/i)).toBeInTheDocument();
    });
  });

  it('should not show deadline for admin role', async () => {
    renderHeaderWithProviders('admin');

    // Check deadline is not displayed
    await waitFor(() => {
      expect(screen.queryByText(/Deadline:/i)).not.toBeInTheDocument();
    });
  });

  it('should show search input for student role', async () => {
    renderHeaderWithProviders('student');

    // Check search input is visible with correct placeholder
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });
  });

  it('should not show search input for admin role', async () => {
    renderHeaderWithProviders('admin');

    // Check search input is not visible
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
    });
  });

  it('should show export to excel option for admin role', async () => {
    renderHeaderWithProviders('admin');

    // Open dropdown menu
    const menuButton = screen.getByRole('button', { name: /▾/ });
    fireEvent.click(menuButton);

    // Check export option exists
    await waitFor(() => {
      expect(screen.getByText(/Export to Excel/i)).toBeInTheDocument();
    });
  });

  it('should show role switch option for admin-student role', async () => {
    renderHeaderWithProviders('admin', 'admin-student');

    // Open dropdown menu
    const menuButton = screen.getByRole('button', { name: /▾/ });
    fireEvent.click(menuButton);

    // Check role switch option exists
    await waitFor(() => {
      expect(screen.getByText(/View as Student|Back to Admin/i)).toBeInTheDocument();
    });
  });

  it('should trigger search with current filters when typing', async () => {
    renderHeaderWithProviders('student');

    // Find search input and type something
    const searchInput = await screen.findByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'math' } });

    // Wait for debounce and verify search was triggered with expected filters
    await waitFor(() => {
      expect(searchApi.searchCoursesByTitle).toHaveBeenCalledWith(
        'math',
        undefined, // programFilter defaults to 'all' which becomes undefined
        'tech'    // courseTypeFilter defaults to 'tech'
      );
    }, { timeout: 1000 });
  });

  it('should debounce search requests', async () => {
    renderHeaderWithProviders('student');
    
    const searchInput = await screen.findByPlaceholderText('Search...');
    
    // Rapidly type multiple characters
    fireEvent.change(searchInput, { target: { value: 'm' } });
    fireEvent.change(searchInput, { target: { value: 'ma' } });
    fireEvent.change(searchInput, { target: { value: 'mat' } });
    fireEvent.change(searchInput, { target: { value: 'math' } });

    // Should only trigger one API call after debounce
    await waitFor(() => {
      expect(searchApi.searchCoursesByTitle).toHaveBeenCalledTimes(1);
    }, { timeout: 1000 });
  });
});