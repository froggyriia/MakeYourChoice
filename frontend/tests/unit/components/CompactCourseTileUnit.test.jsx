import { render, screen } from '@testing-library/react';
import CompactCourseTile from '../../../src/components/CompactCourseTile';

describe('CompactCourseTile', () => {
  it('should display course information correctly', () => {
    const course = {
      id: 1,
      title: 'Test Course',
      program: ['B24-DSAI'],
      language: 'Eng',
      type: 'tech'
    };
    
    render(<CompactCourseTile course={course} />);
    
    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('Program: B24-DSAI')).toBeInTheDocument();
    expect(screen.getByText('Language: Eng')).toBeInTheDocument();
  });
});