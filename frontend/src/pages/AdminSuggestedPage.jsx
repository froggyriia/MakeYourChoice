import { useEffect, useState } from 'react';
import styles from './CataloguePage.module.css';
import { useAuth } from '../context/AuthContext';
import AddCourseModal from '../components/AddCourseModal';
import SuggestedCourseItem from '../components/SuggestedCourseItem';

import {
  fetchSuggestedCourses,
  updateSuggestedCourse,
  acceptSuggestedCourse,
  declineSuggestedCourse,
} from '../api/function_for_suggested_courses';

const AdminSuggestedCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await fetchSuggestedCourses();
      setCourses(data);
      setLoading(false);
    };

    fetchCourses();
  }, []);

  const handleChange = (update) => {
    setEditingCourse((prev) => ({ ...prev, [update.name]: update.value }));
  };

  const handleSaveEdit = async () => {
    try {
      if (!editingCourse?.id) {
        throw new Error('No course selected for editing');
      }

      const { id, ...fieldsToUpdate } = editingCourse;
      const updatedCourse = await updateSuggestedCourse(id, fieldsToUpdate);

      setCourses((prev) =>
        prev.map((course) =>
          course.id === id ? updatedCourse : course
        )
      );
      setEditingCourse(null);
    } catch (err) {
      console.error('Update error:', err);
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleAccept = async (course) => {
    try {
      await acceptSuggestedCourse(course);
      setCourses((prev) => prev.filter((c) => c.id !== course.id));
      setEditingCourse(null);
    } catch (err) {
      console.error('Accept error:', err);
    }
  };

  const handleDecline = async (id) => {
    try {
      await declineSuggestedCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      setEditingCourse(null);
    } catch (err) {
      console.error('Decline error:', err);
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading...</p>;
  }

  return (
    <div className={styles.catalogueWrapper}>
      <h2 className={styles.pageTitle}>All suggested courses</h2>

      {courses.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No suggested courses</p>
      ) : (
        <div className={styles.courseList}>
          {courses.map((course) => (
            <SuggestedCourseItem
              key={course.id}
              course={course}
              onAccept={handleAccept}
              onEdit={(c) => setEditingCourse(c)}
              onDecline={handleDecline}
            />
          ))}
        </div>
      )}

      {editingCourse && (
        <AddCourseModal
          course={editingCourse}
          onChange={handleChange}
          onSubmit={handleSaveEdit}
          onAccept={() => handleAccept(editingCourse)}
          onDecline={() => handleDecline(editingCourse.id)}
          onCancel={() => setEditingCourse(null)}
        />
      )}
    </div>
  );
};

export default AdminSuggestedCoursesPage;