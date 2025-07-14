import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CourseListGrid from '../../src/components/CourseListGrid';
import { CatalogueProvider } from '../../src/context/CatalogueContext';
import { useCatalogue } from '../../src/hooks/useCatalogue';

// Mock CSS modules to return predictable class names
vi.mock('../../src/components/CourseListGrid.module.css', () => ({
  default: {
    highlightMatch: 'highlightMatch',
    table: 'table',
    clickable: 'clickable',
    empty: 'empty'
  },
  highlightMatch: 'highlightMatch',
  table: 'table',
  clickable: 'clickable',
  empty: 'empty'
}));

// Mock the hooks
vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    email: 'test@example.com',
    currentRole: 'admin'
  })
}));

vi.mock('../../src/hooks/useCatalogue', () => ({
  useCatalogue: vi.fn().mockImplementation(() => ({
    searchQuery: '',
    allCourses: [],
    filteredCourses: [],
    isLoading: false,
    error: null,
    setSearchQuery: vi.fn(),
    refreshCourses: vi.fn()
  }))
}));

vi.mock('../../src/hooks/usePrograms', () => ({
  usePrograms: () => ({})
}));

vi.mock('../../src/hooks/useExcelExport', () => ({
  useExcelExport: () => ({})
}));

// Mock data
const mockCourses = [
  {
    id: '1',
    title: 'React Fundamentals',
    teacher: 'John Doe',
    language: 'English',
    program: ['Computer Science', 'Web Development'],
    years: [2023, 2024],
    type: 'tech'
  },
  {
    id: '2',
    title: 'Philosophy 101',
    teacher: 'Jane Smith',
    language: 'French',
    program: ['Humanities'],
    years: [2023],
    type: 'humanities'
  }
];

describe('CourseListGrid Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders course data correctly', () => {
    render(
      <CatalogueProvider>
        <CourseListGrid courses={mockCourses} />
      </CatalogueProvider>
    );

    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Philosophy 101')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Computer Science, Web Development')).toBeInTheDocument();
    expect(screen.getByText('2023, 2024')).toBeInTheDocument();
    expect(screen.getByText('Technical')).toBeInTheDocument();
  });

  it('displays "No available courses" when empty', () => {
    render(
      <CatalogueProvider>
        <CourseListGrid courses={[]} />
      </CatalogueProvider>
    );

    expect(screen.getByText('No available courses')).toBeInTheDocument();
  });

  it('highlights search matches when searchQuery is set', () => {
    // Mock implementation for this test only
    useCatalogue.mockImplementation(() => ({
      searchQuery: 'React',
      allCourses: [],
      filteredCourses: [],
      isLoading: false,
      error: null,
      setSearchQuery: vi.fn(),
      refreshCourses: vi.fn()
    }));

    render(
      <CatalogueProvider>
        <CourseListGrid courses={mockCourses} />
      </CatalogueProvider>
    );

    const highlightedElement = screen.getByText('React');
    // Check for class name using a more flexible matcher
    expect(highlightedElement.className).toMatch(/highlightMatch/);
    expect(highlightedElement.parentElement).toHaveTextContent('React Fundamentals');
  });

  it('calls onRowClick when a row is clicked', () => {
    const mockOnRowClick = vi.fn();
    
    render(
      <CatalogueProvider>
        <CourseListGrid courses={mockCourses} onRowClick={mockOnRowClick} />
      </CatalogueProvider>
    );

    // Find the row containing "React Fundamentals"
    const rows = screen.getAllByRole('row');
    const targetRow = rows.find(row => 
      row.textContent.includes('React Fundamentals')
    );
    
    expect(targetRow).toBeDefined();
    fireEvent.click(targetRow);
    expect(mockOnRowClick).toHaveBeenCalledWith('1');
  });
});