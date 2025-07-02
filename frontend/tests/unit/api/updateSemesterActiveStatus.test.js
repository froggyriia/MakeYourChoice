import { describe, it, expect, vi } from 'vitest';
import { supabase } from '../../../src/pages/supabaseClient.jsx';
import { updateSemesterActiveStatus } from '../../../src/api/functions_for_semesters';
vi.mock('../../../src/pages/supabaseClient.jsx', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    select: vi.fn().mockResolvedValue({
      data: [{ id: 1, semester: 'Sum', semester_year: '2025', is_active: false }],
      error: null
    })
  }
}));

describe('updateSemesterActiveStatus', () => {
  it('успешно обновляет is_active', async () => {
    const result = await updateSemesterActiveStatus('Sum', '2025', false);

    // Проверяем, что Supabase вызывался с правильными параметрами
    expect(supabase.from).toHaveBeenCalledWith('semesters');
    expect(supabase.update).toHaveBeenCalledWith({ is_active: false });
    expect(supabase.eq).toHaveBeenCalledWith('semester', 'Sum');
    expect(supabase.eq).toHaveBeenCalledWith('semester_year', '2025');

    // Проверяем результат
    expect(result.error).toBeNull();
    expect(result.data[0].is_active).toBe(false);
  });

  it('обрабатывает ошибку', async () => {
    // Мокаем ошибку
    supabase.select.mockResolvedValueOnce({
      data: null,
      error: { message: 'Record not found' }
    });

    await expect(updateSemesterActiveStatus('Invalid', '9999', true))
      .rejects.toThrow('Record not found');
  });
});