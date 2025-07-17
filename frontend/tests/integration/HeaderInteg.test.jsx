import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/context/AuthContext';
import { CatalogueProvider } from '../../src/context/CatalogueContext';
import Header from '../../src/components/Header';

// Mock API functions
vi.mock('../../src/api/functions_for_users', () => ({
  getUserProgram: vi.fn().mockResolvedValue('B24-DSAI'),
  getUserYear: vi.fn().mockResolvedValue('2'),
  getPrioritiesNumber: vi.fn().mockResolvedValue({ tech: 5, hum: 5 }),
}));

vi.mock('../../src/api/functions_for_programs', () => ({
  getDeadlineForGroup: vi.fn().mockResolvedValue('2024-06-30T23:59:59Z'),
}));

// Helper to render Header with providers and set localStorage
const renderHeaderWithProviders = (role = 'student', trueRole = role) => {
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

describe('Header Component Simple Integration', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('renders user email and deadline for student role', async () => {
    renderHeaderWithProviders('student');
    expect(await screen.findByText('test@innopolis.university')).toBeInTheDocument();
    expect(await screen.findByText(/Deadline:/i)).toBeInTheDocument();
  });

  it('renders admin navigation links for admin role', async () => {
    renderHeaderWithProviders('admin');
    expect(await screen.findByText('test@innopolis.university')).toBeInTheDocument();
    expect(screen.getByText('Suggested Courses')).toBeInTheDocument();
    expect(screen.getByText('Courses')).toBeInTheDocument();
    expect(screen.getByText('Programs')).toBeInTheDocument();
    expect(screen.getByText('Semesters')).toBeInTheDocument();
    // Deadline should not be present
    expect(screen.queryByText(/Deadline:/i)).not.toBeInTheDocument();
  });
});