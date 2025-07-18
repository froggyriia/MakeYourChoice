import Fuse from 'fuse.js';
import { supabase } from '../pages/supabaseClient.jsx';

/**
 * Enhanced search function that respects current filters
 * @param {string} query - Search text
 * @param {string} currentProgram - Current program filter
 * @param {string} currentType - Current course type filter
 * @returns {Promise<Array>} - Filtered courses
 */
export async function searchCoursesByTitle(query, courses, currentType) {
  try {
    // Если courses не передан, возвращаем пустой массив
    if (!courses || !Array.isArray(courses)) {
      console.warn('No courses array provided for search');
      return [];
    }

    // Применяем фильтр по типу, если указан
    let filteredCourses = courses;
    if (currentType && currentType !== 'all') {
      filteredCourses = courses.filter(course => course.type === currentType);
    }
    if (!query || query.trim() === '') return data;

    // Возвращаем все отфильтрованные курсы, если нет поискового запроса
    if (!query || query.trim() === '') {
      return filteredCourses;
    }

    // Настраиваем fuzzy search
    const fuse = new Fuse(filteredCourses, {
    const sanitizedData = data.map((course) => ({
      ...course,
      description: course.description || '',
      title: course.title || '',
      teacher: course.teacher || '',
    }));

    const fuse = new Fuse(sanitizedData, {
      keys: ['title', 'description', 'teacher'],
      threshold: 0.3,
      includeMatches: true,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });

    // Выполняем поиск и преобразуем результат
    const result = fuse.search(query);

    return result.map(({ item, matches }) => ({
      ...item,
      _matches: matches, // Добавляем информацию о совпадениях
    }));

  } catch (err) {
    console.error('Unexpected error during course search:', err);
    return [];
  }
}
