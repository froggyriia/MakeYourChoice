import { describe, it, expect, vi } from 'vitest';
import { supabase } from '../../../src/pages/supabaseClient.jsx';
import { archiveCourse } from '../../../src/api/functions_for_courses';

vi.mock('../../../src/pages/supabaseClient.jsx', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("archiveCourse", () => {
  const mockUpdate = vi.fn();
  const mockEq = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    supabase.from.mockReturnValue({
      update: mockUpdate.mockReturnValue({
        eq: mockEq,
      }),
    });
  });

  it("successfully archive the course and return the data", async () => {
    const fakeData = [{ id: 1, archived: true }];
    mockEq.mockResolvedValue({ data: fakeData, error: null });

    const result = await archiveCourse(1);

    expect(supabase.from).toHaveBeenCalledWith("catalogue");
    expect(mockUpdate).toHaveBeenCalledWith({ archived: true });
    expect(mockEq).toHaveBeenCalledWith("id", 1);
    expect(result).toEqual(fakeData);
  });

  it("return null on error", async () => {
    const fakeError = new Error("DB error");
    mockEq.mockResolvedValue({ data: null, error: fakeError });

    const result = await archiveCourse(2);

    expect(result).toBeNull();
  });

  it("catch the exception and return null", async () => {
    mockEq.mockRejectedValue(new Error("Unexpected failure"));

    const result = await archiveCourse(3);

    expect(result).toBeNull();
  });
});