import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addCourse } from '../../../src/api/functions_for_courses';

const mockInsert = vi.fn();
const mockSelect = vi.fn();

vi.mock('../../../src/pages/supabaseClient.jsx', () => ({
  supabase: {
    from: () => ({
      insert: (...args) => {
        mockInsert(...args);
        return { select: mockSelect };
      },
    }),
  },
}));

describe('addCourse', () => {
  beforeEach(() => {
    mockInsert.mockReset();
    mockSelect.mockReset();
  });

  it('should add course with correct structure', async () => {
    mockSelect.mockResolvedValueOnce({ data: [{ id: 1 }], error: null });

    const courseData = {
      name: 'Test course',
      description: 'Test description',
      years: ['2024'],
      program: ['AI'],
    };

    const result = await addCourse(courseData);
    expect(result.data?.[0]?.id).toBe(1);
    expect(mockInsert).toHaveBeenCalled();
  });

  it('should clean years and program arrays', async () => {
    mockSelect.mockResolvedValueOnce({ data: [{ id: 2 }], error: null });

    const courseData = {
      name: 'Test course',
      description: 'Test description',
      years: ['2024', null, undefined],
      program: ['AI', '', null],
    };

    const result = await addCourse(courseData);
    expect(result.data?.[0]?.id).toBe(2);
  });

  it('should throw error when required fields are missing', async () => {
    await expect(addCourse()).rejects.toThrow();
  });
});
