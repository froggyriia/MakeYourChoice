import { supabase } from '../pages/supabaseClient.jsx';

// Получение всех предложенных курсов
export const fetchSuggestedCourses = async () => {
  const { data, error } = await supabase
    .from('suggested_courses')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error('Error while loading suggested courses:', error);
    return [];
  }

  return data || [];
};

// Обновление предложенного курса
export const updateSuggestedCourse = async (id, fieldsToUpdate) => {
  if (!id) {
    throw new Error('Course ID is required');
  }

  // Преобразуем years и program в массивы, если они не массивы
  const processedFields = {
    ...fieldsToUpdate,
    years: Array.isArray(fieldsToUpdate.years) ?
          fieldsToUpdate.years :
          [fieldsToUpdate.years],
    program: Array.isArray(fieldsToUpdate.program) ?
            fieldsToUpdate.program :
            [fieldsToUpdate.program]
  };

  const { data, error } = await supabase
    .from('suggested_courses')
    .update(processedFields)
    .eq('id', id)
    .select(); // Добавляем .select() чтобы получить обновленные данные

  if (error) {
    console.error('Error updating suggested course:', error);
    throw error;
  }

  return data?.[0]; // Возвращаем первый элемент массива
};

// Принятие предложенного курса
export const acceptSuggestedCourse = async (course) => {
  try {
    const {
      title,
      description,
      teacher,
      language,
      type,
      years,
      program,
    } = course;

    const newCourse = {
      title,
      description,
      teacher,
      language,
      type,
      years: Array.isArray(years) ? years : [years],
      program: Array.isArray(program) ? program : [program],
      archived: false,
    };

    const { error: insertError } = await supabase
      .from('catalogue')
      .insert([newCourse]);

    if (insertError) {
      console.error('Error inserting into catalogue:', insertError);
      throw insertError;
    }

    const { error: deleteError } = await supabase
      .from('suggested_courses')
      .delete()
      .eq('id', course.id);

    if (deleteError) {
      console.error('Error deleting from suggested_courses:', deleteError);
      throw deleteError;
    }

    return true;
  } catch (err) {
    console.error('Error in acceptSuggestedCourse:', err);
    throw err;
  }
};

// Отклонение предложенного курса
export const declineSuggestedCourse = async (id) => {
  const { error } = await supabase
    .from('suggested_courses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error declining suggested course:', error);
    throw error;
  }

  return true;
};