import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ElectivesForm from '../../../src/components/ElectivesForm.jsx';

// Mock necessary modules
vi.mock('../../../src/api/functions_for_courses.js', () => ({
  fetchCourses: vi.fn(() => Promise.resolve([
    { id: 1, title: 'Course 1', type: 'tech' },
    { id: 2, title: 'Course 2', type: 'tech' }
  ]))
}));

vi.mock('../../../src/api/functions_for_programs.js', () => ({
  getProgramInfo: vi.fn(() => Promise.resolve({ tech: 2, hum: 1 }))
}));

vi.mock('../../../src/context/AuthContext.jsx', () => ({
  useAuth: () => ({ email: 'test@example.com', role: 'student' })
}));

// Mock CSS module
vi.mock('../../../src/components/ElectivesForm.module.css', () => ({
  default: {
    wrapper: 'wrapper',
    container: 'container',
    form: 'form',
    field: 'field',
    select: 'select',
    buttonsRow: 'buttonsRow',
    submitButton: 'submitButton',
    noCoursesMessage: 'noCoursesMessage'
  }
}));

describe('ElectivesForm Submit button', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should call onSubmit with selected courses when submitted', async () => {
    const mockSubmit = vi.fn();
    render(<ElectivesForm type="tech" onSubmit={mockSubmit} />);
    
    // Wait for the form to load (until "Loading..." disappears)
    await screen.findByText('Technical Electives');
    
    // Select courses in the dropdowns
    const select1 = screen.getByLabelText('Priority 1');
    const select2 = screen.getByLabelText('Priority 2');
    
    fireEvent.change(select1, { target: { value: 'Course 1' } });
    fireEvent.change(select2, { target: { value: 'Course 2' } });
    
    // Click the Submit button
    fireEvent.click(screen.getByText('Submit'));
    
    // Verify that onSubmit was called with correct arguments
    expect(mockSubmit).toHaveBeenCalledWith(['Course 1', 'Course 2'], 'tech');
  });
});