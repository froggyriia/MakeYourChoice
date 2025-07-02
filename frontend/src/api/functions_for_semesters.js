import { supabase } from '../pages/supabaseClient.jsx';

export const saveSemesterInfo = async (semData) => {
  try {
    const { id, ...dataWithoutId } = semData;
    const { data, error } = await supabase
      .from('semesters')
      .insert(dataWithoutId)
      .select();

    if (error) throw error;
    return { data, error };
  } catch (error) {
    console.error('Error adding course:', error.message);
    throw error;
  }
};

export const updateSemesterActiveStatus = async (semester, semester_year, isActive) => {
  try {
    const { data, error } = await supabase
      .from('semesters')
      .update({ is_active: isActive })
      .eq('semester', semester)
      .eq('semester_year', semester_year)
      .select();

    if (error) throw error;
    return { data, error };
  } catch (error) {
    console.error('Error updating semester active status:', error.message);
    throw error;
  }
};
