import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ElectivesForm from '../../../src/components/ElectivesForm';
import { useAuth } from '../../../src/context/AuthContext';
import { useFormSubmit } from '../../../src/hooks/useFormSubmit';

// Mocks
vi.mock('../../../src/api/functions_for_courses', () => ({
  fetchCourses: vi.fn().mockResolvedValue([
    { id: 1, title: 'Advanced React', type: 'tech' },
    { id: 2, title: 'Machine Learning', type: 'tech' }
  ])
}));

vi.mock('../../../src/api/functions_for_programs', () => ({
  getProgramInfo: vi.fn().mockResolvedValue({
    tech: 2,
    hum: 1
  })
}));

vi.mock('../../../src/context/AuthContext', () => ({
  useAuth: vi.fn().mockReturnValue({
    email: 'student@test.com',
    role: 'student',
    loading: false
  })
}));

vi.mock('../../../src/hooks/useFormSubmit', () => ({
  useFormSubmit: vi.fn().mockReturnValue({
    studentsPreferences: [],
    onSubmit: vi.fn(),
    limits: { tech: 2, hum: 1 }
  })
}));

describe('ElectivesForm Submission', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render and submit tech electives', async () => {
    render(<ElectivesForm type="tech" onSubmit={useFormSubmit().onSubmit} />);

    await waitFor(() => {
      expect(screen.getByText('Technical Electives')).toBeInTheDocument();
    });

    const priority1 = screen.getByLabelText('Priority 1');
    const priority2 = screen.getByLabelText('Priority 2');
    const submitBtn = screen.getByText('Submit');

    fireEvent.change(priority1, { target: { value: 'Advanced React' } });
    fireEvent.change(priority2, { target: { value: 'Machine Learning' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(useFormSubmit().onSubmit).toHaveBeenCalledWith(
        ['Advanced React', 'Machine Learning'],
        'tech'
      );
    });
  });
});