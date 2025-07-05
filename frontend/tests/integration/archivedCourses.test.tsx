import { describe, it, expect, vi, afterEach } from 'vitest';
import { archivedCourses } from '../../src/api/functions_for_courses';
import { supabase } from '../../src/pages/supabaseClient.jsx';

vi.mock('../../src/pages/supabaseClient.jsx', () => {
  return {
    supabase: {
      from: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    },
  };
});

describe('archivedCourses', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should toggle archive status and return data on success', async () => {
    const mockData = { id: 1, archived: true };
    const mockResponse = { data: mockData, error: null };

    supabase.from.mockImplementation(() => supabase);
    supabase.update.mockImplementation(() => supabase);
    supabase.eq.mockImplementation(() => supabase);
    supabase.from().update().eq.mockResolvedValue(mockResponse);

    const courseId = 1;
    const currentStatus = false;
    const result = await archivedCourses(courseId, currentStatus);

    expect(supabase.from).toHaveBeenCalledWith('catalogue');
    expect(supabase.update).toHaveBeenCalledWith({ archived: !currentStatus });
    expect(supabase.eq).toHaveBeenCalledWith('id', courseId);
    expect(result).toEqual(mockData);
  });

  it('should return null and log error when Supabase fails', async () => {
    const mockError = new Error('Database error');
    const mockResponse = { data: null, error: mockError };

    supabase.from.mockImplementation(() => supabase);
    supabase.update.mockImplementation(() => supabase);
    supabase.eq.mockImplementation(() => supabase);
    supabase.from().update().eq.mockResolvedValue(mockResponse);

    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    const courseId = 1;
    const currentStatus = false;
    const result = await archivedCourses(courseId, currentStatus);

    expect(supabase.from).toHaveBeenCalledWith('catalogue');
    expect(supabase.update).toHaveBeenCalledWith({ archived: !currentStatus });
    expect(supabase.eq).toHaveBeenCalledWith('id', courseId);
    expect(result).toBeNull();
    expect(consoleErrorMock).toHaveBeenCalledWith('Error occurred');

    consoleErrorMock.mockRestore();
  });
});