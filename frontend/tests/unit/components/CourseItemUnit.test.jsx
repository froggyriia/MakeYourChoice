import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createContext } from 'react';
import CourseItem from '@/components/CourseItem.jsx';

// 1. First, mock the CatalogueContext module before imports are hoisted
vi.mock('@/context/CatalogueContext', async (importOriginal) => {
  const MockCatalogueContext = createContext({
    catalogue: {
      searchQuery: '',
      // Add other required catalogue properties
    },
  });

  return {
    __esModule: true,
    default: MockCatalogueContext,
    useCatalogueContext: () => ({
      catalogue: {
        searchQuery: '',
        // Add other required properties
      }
    }),
  };
});

// 2. Mock other required hooks
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    email: 'test@example.com',
    currentRole: 'student',
    // Add other required auth properties
  }),
}));

describe('CourseItem - Show more button', () => {
  const mockCourse = {
    id: 1,
    title: 'Test Course',
    teacher: 'Test Teacher',
    language: 'English',
    program: ['CS'],
    years: [2023],
    type: 'Lecture',
    description: 'Test description',
    archived: false
  };

  beforeEach(() => {
    // Clear all mocks before each test if needed
    vi.clearAllMocks();
  });

  it('should render the Show more button', () => {
    render(<CourseItem course={mockCourse} />);
    expect(screen.getByText('Show more')).toBeInTheDocument();
  });

  it('should toggle description visibility when clicked', () => {
    render(<CourseItem course={mockCourse} />);
    
    const button = screen.getByText('Show more');
    fireEvent.click(button);
    
    expect(screen.getByText('Show less')).toBeInTheDocument();
    expect(screen.getByText(mockCourse.description)).toBeInTheDocument();
    
    fireEvent.click(button);
    
    expect(screen.getByText('Show more')).toBeInTheDocument();
    expect(screen.queryByText(mockCourse.description)).not.toBeInTheDocument();
  });

  it('should change button text based on isOpen state', () => {
    render(<CourseItem course={mockCourse} />);
    
    const button = screen.getByRole('button', { name: /Show more/i });
    expect(button).toHaveTextContent('Show more');
    
    fireEvent.click(button);
    expect(button).toHaveTextContent('Show less');
    
    fireEvent.click(button);
    expect(button).toHaveTextContent('Show more');
  });
});