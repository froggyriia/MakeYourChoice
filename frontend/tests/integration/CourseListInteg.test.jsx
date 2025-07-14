// frontend/tests/integration/CourseList.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import CourseList from '../../src/components/CourseList';
import { AuthProvider } from '../../src/context/AuthContext';

// Mock the validation module
vi.mock('../../src/hooks/validation.js', () => ({
  isAdmin: vi.fn(),
  isStudent: vi.fn()
}));

// Mock the CourseItem component
vi.mock('../../src/components/CourseItem', () => ({
  default: vi.fn(({ course, role }) => (
    <div data-testid="course-item">
      {course.name} (Role: {role})
    </div>
  ))
}));

describe('CourseList Integration with AuthContext', () => {
  const mockCourses = [
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'Physics' }
  ];

  const mockHandlers = {
    onDeleteCourse: vi.fn(),
    onEditCourse: vi.fn(),
    onArchiveCourse: vi.fn()
  };

  beforeEach(async () => {
    localStorage.clear();
    vi.clearAllMocks();
    
    const validation = await import('../../src/hooks/validation.js');
    validation.isAdmin.mockReset();
    validation.isStudent.mockReset();
  });

  const renderWithAuth = async (role, email) => {
    const validation = await import('../../src/hooks/validation.js');
    validation.isAdmin.mockResolvedValue(role === 'admin');
    validation.isStudent.mockResolvedValue(role === 'student');

    localStorage.setItem('currentRole', role);
    localStorage.setItem('email', email);
    localStorage.setItem('trueRole', role);

    await act(async () => {
      render(
        <AuthProvider>
          <CourseList courses={mockCourses} {...mockHandlers} />
        </AuthProvider>
      );
    });
  };

  it('should render with student role when user is student', async () => {
    await renderWithAuth('student', 'student@example.com');
    const items = await screen.findAllByTestId('course-item');
    expect(items[0]).toHaveTextContent('Mathematics (Role: student)');
  });

  it('should render with admin role when user is admin', async () => {
    await renderWithAuth('admin', 'admin@example.com');
    const items = await screen.findAllByTestId('course-item');
    expect(items[0]).toHaveTextContent('Mathematics (Role: admin)');
  });

  it('should show empty state when no courses', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <CourseList courses={[]} {...mockHandlers} />
        </AuthProvider>
      );
    });
    expect(screen.getByText('No available courses')).toBeInTheDocument();
  });

  it('should reflect role changes when AuthContext updates', async () => {
    // First render with student role
    await renderWithAuth('student', 'student@example.com');
    expect((await screen.findAllByTestId('course-item'))[0])
      .toHaveTextContent('Mathematics (Role: student)');

    // Change to admin role
    const validation = await import('../../src/hooks/validation.js');
    validation.isAdmin.mockResolvedValue(true);
    validation.isStudent.mockResolvedValue(false);

    localStorage.setItem('currentRole', 'admin');
    localStorage.setItem('email', 'admin@example.com');
    localStorage.setItem('trueRole', 'admin');

    // Need to force a re-render by changing a prop
    await act(async () => {
      render(
        <AuthProvider>
          <CourseList 
            courses={mockCourses} 
            {...mockHandlers} 
            data-testid="rerendered"
          />
        </AuthProvider>,
        { container: document.body }
      );
    });

    // Verify role changed to admin
    expect((await screen.findAllByTestId('course-item'))[0])
      .toHaveTextContent('Mathematics (Role: admin)');
  });
});