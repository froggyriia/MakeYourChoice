import { useEffect, useState } from 'react';
import styles from './CataloguePage.module.css';
import AddCourseModal from '../components/AddCourseModal';
import DeclinedCourseItem from '../components/DeclinedCourseItem';
import { NavLink } from 'react-router-dom';

import {
  fetchDeclinedCourses,
  recoverSuggestedCourse,
  deleteDeclinedCourse,
} from '../api/function_for_suggested_courses';

const DeclinedCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeclinedCourses = async () => {
      const data = await fetchDeclinedCourses();
      setCourses(data);
      setLoading(false);
    };

    loadDeclinedCourses();
  }, []);

  const handleRecover = async (course) => {
      try {
        await recoverSuggestedCourse(course.id);
        setCourses((prev) => prev.filter((c) => c.id !== course.id));
      } catch (err) {
        console.error('Recover failed:', err);
        alert('Failed to recover the course');
      }
  };

  const handleDelete = async (id) => {
      try {
        await deleteDeclinedCourse(id);
        setCourses((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete the course');
      }
  };

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading...</p>;
  }

  return (
    <div className={styles.catalogueWrapper}>
        {/* Title and Return to Suggested Courses button */}
            <div className={styles.headerContainer}>
                <h2>Declined courses</h2>
                <NavLink
                    to="/admin/suggested_courses"
                    className={styles.addCourseButton}
                >
                    Return to Suggested Courses
                </NavLink>
            </div>

      {courses.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No declined courses</p>
      ) : (
        <div className={styles.courseList}>
          {courses.map((course) => (
            <DeclinedCourseItem
              key={course.id}
              course={course}
              onDelete={handleDelete}
              onRecover={handleRecover}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DeclinedCoursesPage;