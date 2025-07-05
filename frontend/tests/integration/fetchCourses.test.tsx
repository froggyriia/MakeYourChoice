import React from 'react';
import { render, act } from '@testing-library/react';
import { vi, describe, it, beforeAll, afterAll, expect } from 'vitest';
import { fetchCourses } from '../../src/api/functions_for_courses'
import { supabase } from '../../src/pages/supabaseClient.jsx';
import { getUserProgram, getUserYear } from '../../src/api/functions_for_users.js';

vi.mock('../../src/pages/supabaseClient.jsx')
vi.mock('../../src/api/functions_for_users.js');

describe('fetchCourses', () => {
  const mockEmail = 'test@example.com';
  const mockUserProgram = 'Computer Science';
  const mockUserYear = 2;

  const mockCourses = [
    { id: 1, title: 'Course 1', program: [mockUserProgram], years: [mockUserYear], archived: false, type: 'lecture', language: 'en' },
    { id: 2, title: 'Course 2', program: [mockUserProgram], years: [mockUserYear], archived: false, type: 'seminar', language: 'ru' },
    { id: 3, title: 'Course 3', program: ['Other Program'], years: [mockUserYear], archived: false, type: 'lecture', language: 'en' },
    { id: 4, title: 'Course 4', program: [mockUserProgram], years: [3], archived: false, type: 'lecture', language: 'en' },
  ];

  const mockHistory = [
    { email: mockEmail, course: 'Course 1' },
    { email: mockEmail, course: null },
  ];

  beforeEach(() => {
    vi.resetAllMocks();

    getUserProgram.mockResolvedValue(mockUserProgram);
    getUserYear.mockResolvedValue(mockUserYear);

    supabase.from.mockImplementation((table) => {
      if (table === 'catalogue') {
        return {
          select: vi.fn().mockReturnThis(),
          contains: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: vi.fn().mockImplementation((callback) => {
            callback({ data: mockCourses, error: null });
            return { catch: vi.fn() };
          }),
        };
      }
      if (table === 'history') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: vi.fn().mockImplementation((callback) => {
            callback({ data: mockHistory, error: null });
            return { catch: vi.fn() };
          }),
        };
      }
    });
  });


  it('should apply additional filters when provided', async () => {
    const filters = {
      types: ['lecture'],
      languages: ['en'],
      programs: [mockUserProgram],
      isArchived: false,
    };

    const result = await fetchCourses(mockEmail, false, filters);
  });


  it('should return empty array if user program not found', async () => {
    getUserProgram.mockResolvedValue(null);

    const result = await fetchCourses(mockEmail);
    expect(result).toEqual([]);
  });

  it('should return empty array if user year not found', async () => {
    getUserYear.mockResolvedValue(null);

    const result = await fetchCourses(mockEmail);
    expect(result).toEqual([]);
  });

  it('should handle supabase errors gracefully', async () => {
    supabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      then: vi.fn().mockImplementation((callback) => {
        callback({ data: null, error: new Error('Database error') });
        return { catch: vi.fn() };
      }),
    }));

    const result = await fetchCourses(mockEmail);
    expect(result).toEqual([]);
  });
});