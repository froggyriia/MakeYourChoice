import { describe, it, expect, vi } from 'vitest';
import { supabase } from '../../../src/pages/supabaseClient.jsx';
import { deleteCourse } from '../../../src/api/functions_for_courses';

vi.mock('../../../src/pages/supabaseClient.jsx', () => ({
  supabase: {
    from: vi.fn()
  }
}));

describe('deleteCourse', () => {
  const mockDelete = vi.fn();
  const mockEq = vi.fn();

  beforeEach(() => {
    mockEq.mockReset();
    mockDelete.mockReset();

    mockDelete.mockReturnValue({ eq: mockEq });
    supabase.from.mockReturnValue({ delete: mockDelete });
  });

  it('should delete a course by title successfully', async () => {
    mockEq.mockResolvedValue({ error: null });

    const result = await deleteCourse('JavaScript Basics');

    expect(supabase.from).toHaveBeenCalledWith('catalogue');
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('title', 'JavaScript Basics');
    expect(result).toEqual({ error: null });
  });

  it('should return an error if supabase returns one', async () => {
    const testError = { message: 'Failed to delete' };
    mockEq.mockResolvedValue({ error: testError });

    const result = await deleteCourse('React Course');

    expect(result).toEqual({ error: testError });
  });

  it('should catch and return an unexpected exception', async () => {
    supabase.from.mockImplementation(() => {
      throw new Error('Unexpected failure');
    });

    const result = await deleteCourse('Vue Course');

    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('Unexpected failure');
  });
});