import { searchCoursesByTitle } from './api/functions_for_courses.js';

async function testSearch() {
  const results = await searchCoursesByTitle('math'); // Пример запроса
  console.log('Found courses:', results);
}

testSearch();
