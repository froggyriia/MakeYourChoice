import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import CourseList from './CourseList';

vi.mock('./CourseItem', () => ({
  default: ({ course, onDelete, onEdit, onArchive }) => (
    <div data-testid="course-item">
      <span>{course.name}</span>
      <button onClick={() => onDelete(course.id)}>Delete</button>
      <button onClick={() => onEdit(course.id)}>Edit</button>
      <button onClick={() => onArchive(course.id)}>Archive</button>
    </div>
  )
}));

describe('CourseList Integration Test', () => {
  const mockDelete = vi.fn();
  const mockEdit = vi.fn();
  const mockArchive = vi.fn();

  const sampleCourses = [
    { id: 1, name: 'Course 1' },
    { id: 2, name: 'Course 2' },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders list of courses', () => {
    render(
      <CourseList
        courses={sampleCourses}
        onDeleteCourse={mockDelete}
        onEditCourse={mockEdit}
        onArchiveCourse={mockArchive}
      />
    );

    const courseItems = screen.getAllByTestId('course-item');
    expect(courseItems).toHaveLength(sampleCourses.length);

    expect(screen.getByText('Course 1')).toBeInTheDocument();
    expect(screen.getByText('Course 2')).toBeInTheDocument();
  });

  test('displays fallback message when no courses', () => {
    render(
      <CourseList
        courses={[]}
        onDeleteCourse={mockDelete}
        onEditCourse={mockEdit}
        onArchiveCourse={mockArchive}
      />
    );

    expect(screen.getByText(/no available courses/i)).toBeInTheDocument();
  });

  test('calls appropriate callbacks when buttons clicked', () => {
    render(
      <CourseList
        courses={[{ id: 1, name: 'Course 1' }]}
        onDeleteCourse={mockDelete}
        onEditCourse={mockEdit}
        onArchiveCourse={mockArchive}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(mockDelete).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText('Edit'));
    expect(mockEdit).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText('Archive'));
    expect(mockArchive).toHaveBeenCalledWith(1);
  });
});
