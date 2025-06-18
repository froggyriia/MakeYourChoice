import { supabase } from '../pages/supabaseClient.jsx';

export const setDeadline = async (programTitle, deadline) => {
  try {
    const { data, error } = await supabase
    .from('groups_electives')
    .update(deadlines: deadline)
    .eq('student_group', programTitle)
    .select()
    .single();
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating program deadline:', error.message);
    throw error;
  }
}