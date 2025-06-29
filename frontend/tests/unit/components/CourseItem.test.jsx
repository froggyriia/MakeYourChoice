import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CourseItem from '@/components/CourseItem.jsx';

describe('CourseItem - Show more button', () => {
  // Mock course data for testing
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

  // Test that the Show more button renders by default
  it('should render the Show more button', () => {
    render(<CourseItem course={mockCourse} />);
    expect(screen.getByText('Show more')).toBeInTheDocument();
  });

  // Test the toggle functionality of the Show more/less button
  it('should toggle description visibility when clicked', () => {
    render(<CourseItem course={mockCourse} />);
    
    const button = screen.getByText('Show more');
    // First click should show description and change button text
    fireEvent.click(button);
    
    expect(screen.getByText('Show less')).toBeInTheDocument();
    expect(screen.getByText(mockCourse.description)).toBeInTheDocument();
    
    // Second click should hide description and revert button text
    fireEvent.click(button);
    
    expect(screen.getByText('Show more')).toBeInTheDocument();
    expect(screen.queryByText(mockCourse.description)).not.toBeInTheDocument();
  });

  // Test button text changes based on state
  it('should change button text based on isOpen state', () => {
    render(<CourseItem course={mockCourse} />);
    
    const button = screen.getByRole('button', { name: /Show more/i });
    // Initial state
    expect(button).toHaveTextContent('Show more');
    
    // After first click
    fireEvent.click(button);
    expect(button).toHaveTextContent('Show less');
    
    // After second click (back to initial)
    fireEvent.click(button);
    expect(button).toHaveTextContent('Show more');
  });
});