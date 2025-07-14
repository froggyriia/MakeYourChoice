import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import LoginForm from '../../../src/components/LoginForm';

function setup() {
  const mockOnSubmit = vi.fn();
  const mockSetEmail = vi.fn();
  render(
    <LoginForm
      email="test@example.com"
      setEmail={mockSetEmail}
      onSubmit={mockOnSubmit}
      error=""
    />
  );
  return { mockOnSubmit, mockSetEmail };
}

test('calls onSubmit on form submit', () => {
  const { mockOnSubmit } = setup();

  const form = screen.getByRole('form') || screen.getByRole('button').closest('form');

  fireEvent.submit(form);

  expect(mockOnSubmit).toHaveBeenCalled();
});
