// utils/courseApi.js
import { supabase } from './supabaseClient.js';

// Получить все курсы (или фильтр по типу, если нужно)
export const getCourses = async () => {
    const { data, error } = await supabase
        .from('courses')
        .select('*');

    if (error) throw error;
    return data;
};

// Добавить новый курс
export const addCourse = async (course) => {
    const { error } = await supabase
        .from('courses')
        .insert([course]);

    if (error) throw error;
};
