import { describe, it, expect, vi, beforeEach } from 'vitest';
import { editCourseInfo } from '../../../src/api/functions_for_courses';

const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockSelect = vi.fn();

vi.mock('../../../src/pages/supabaseClient.jsx', () => ({
  supabase: {
    from: () => ({
      update: (...args) => {
        mockUpdate(...args);
        return {
          eq: (field, value) => {
            mockEq(field, value);
            return { select: mockSelect };
          },
        };
      },
    }),
  },
}));

describe('editCourseInfo', () => {
  beforeEach(() => {
    mockUpdate.mockReset();
    mockEq.mockReset();
    mockSelect.mockReset();
  });

  it('should update course info correctly', async () => {
    mockSelect.mockResolvedValueOnce({ data: [{ id: 1 }], error: null });

    const courseNewData = {
      id: 1,
      name: 'Updated course',
      description: 'Updated description',
    };

    const result = await editCourseInfo(courseNewData);
    expect(result.id).toBe(1);
  });

  it('should throw if id is missing', async () => {
    await expect(editCourseInfo({})).rejects.toThrow();
  });
});
