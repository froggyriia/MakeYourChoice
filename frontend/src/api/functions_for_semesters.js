import { supabase } from '../pages/supabaseClient.jsx';
/**
 * Saves semester information to the database.
 * If a semester with the given name and year exists, updates it; otherwise creates a new record.
 * @param {Object} semData - Semester data object
 * @param {string} semData.semester - Semester name (e.g., "Fall")
 * @param {number} semData.semester_year - Academic year
 * @param {Array} [semData.courses] - List of courses
 * @returns {Promise<Array>} Array of saved semester records
 * @throws {Error} If database operation fails
 */
export const saveSemesterInfo = async (semData) => {
  try {

    const { id, ...dataWithoutId } = semData;

    let result;

    if (await isSemesterExists(dataWithoutId.semester, dataWithoutId.semester_year)) {
      result = await supabase
        .from('semesters')
        .update(dataWithoutId)
        .eq('semester', dataWithoutId.semester)
        .eq('semester_year', dataWithoutId.semester_year)
        .select();
    } else {
      result = await supabase
        .from('semesters')
        .insert(dataWithoutId)
        .select();
    }

    const updateResult = await supabase
        .from('groups_electives')
        .update({ deadline: dataWithoutId.deadline })
        .in('student_group', dataWithoutId.program)
        .select();

    if (result.error) throw result.error;
    return result.data;
  } catch (error) {
    console.error('Error saving semester info:', error.message);
    throw error;
  }
};
/**
 * Retrieves semester information from the database.
 * @param {Object} semData - Semester identifier object
 * @param {string} semData.semester - Semester name
 * @param {number} semData.semester_year - Academic year
 * @returns {Promise<Array|null>} Array of semester records if found, null otherwise
 * @throws {Error} If database operation fails
 */
export const getSemesterInfo = async (semData) => {
  try {
    let result;

    if (await isSemesterExists(semData.semester, semData.semester_year)) {
       result = await supabase
      .from('semesters')
      .select('*')
      .eq('semester', semData.semester)
      .eq('semester_year', semData.semester_year);
    }
    else {
        return null;
    }

    if (result.error) throw result.error;
    return result.data;
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
/**
 * Checks if a semester exists in the database.
 * @param {string} semTitle - Semester name
 * @param {number} semYear - Academic year
 * @returns {Promise<boolean>} True if semester exists, false otherwise
 * @throws {Error} If database operation fails
 */
export const isSemesterExists = async (semTitle, semYear) => {
  try {
    const { data, error } = await supabase
      .from('semesters')
      .select('courses')
      .eq('semester', semTitle)
      .eq('semester_year', semYear)
      .limit(1);

    if (error) throw error;
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking if semester exists:', error.message);
    throw error;
  }
};

/**
 * Получает последнюю запись из таблицы, где semester равен заданному значению
 * @param {string} semester - Значение семестра для поиска
 * @returns {Promise<Object|null>} Последняя запись или null, если не найдено
 */
export async function getLatestRecordBySemester(semesterName) {
  try {
    const { data, error } = await supabase
      .from('semesters')
      .select('*')
      .eq('semester', semesterName)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Ошибка при получении записи:', error.message);
    return null;
  }
}

/**
 * Fetch a single semester by its PK.
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function getSemesterById(id) {
  const { data, error } = await supabase
      .from('semesters')
      .select('*')
      .eq('id', id)
      .single();

  if (error) throw error;
  return data;
}
/**
 * Находит единственный активный семестр
 * @param {string} tableName - Название таблицы (по умолчанию 'your_table_name')
 * @returns {Promise<Object|boolean>} Активная запись или false
 */
export async function isSingleActiveSemester() {
  try {
    const { data: activeRecords, error } = await supabase
      .from('semesters')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    if (activeRecords.length === 1) {
      return activeRecords[0];
    }

    return false;

  } catch (error) {
    console.error('Ошибка при проверке активных семестров:', error.message);
    return false;
  }
}

/**
* Проверяет может ли студент иметь доступ к форме и каталогу в данной итерации
* @param {string} email - почта студента
* @param {Promise<Object>} - объект семестра который активен
* @returns {boolean} - имеет студент доступ или нет
*/

export async function isStudentAllowedInSemester(email, semester) {
try {
    const userProgram = await getUserProgram(email);
    const userYear = await getUserYear(email);

    if (!userProgram || !userYear) {
      console.warn('Не удалось получить данные студента');
      return false;
    }

    // 2. Проверяем, что семестр существует и содержит programs
    if (!semester || !semester.programs || !Array.isArray(semester.programs)) {
      console.warn('Некорректные данные семестра');
      return false;
    }

    // 3. Проверяем совпадение программы студента с программами семестра
    const isProgramAllowed = semester.programs.includes(userProgram);

    return isProgramAllowed;

} catch (error) {
    console.error('Ошибка при проверке возможностей студента:', error.message);
    return false;
  }
}

/**
 * Получает все записи из таблицы semesters
 * @returns {Promise<Array>} Массив всех семестров или пустой массив при ошибке
 */
export async function getAllSemesters() {
  try {
    const { data: semesters, error } = await supabase
      .from('semesters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return semesters || [];

  } catch (error) {
    console.error('Ошибка при получении семестров:', error.message);
    return [];
  }
}