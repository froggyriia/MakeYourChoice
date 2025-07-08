// AdminSuggestedCoursesPage.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../pages/supabaseClient.jsx';
import styles from './CataloguePage.module.css';
import { useAuth } from '../context/AuthContext';
import AddCourseModal from '../components/AddCourseModal';

const AdminSuggestedCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('suggested_courses')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error while data loading:', error);
        setCourses([]);
      } else {
        setCourses(data || []);
      }

      setLoading(false);
    };

    fetchCourses();
  }, []);

  const handleChange = (key, value) => {
    setEditingCourse((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const { id, ...fieldsToUpdate } = editingCourse;
      const { data, error } = await supabase
        .from('suggested_courses')
        .update(fieldsToUpdate)
        .eq('id', id);

      if (error) throw error;

      setCourses((prev) =>
        prev.map((course) => (course.id === id ? { ...course, ...fieldsToUpdate } : course))
      );
      setEditingCourse(null);
    } catch (err) {
      console.error('Ошибка при сохранении редактирования:', err);
    }
  };

  const handleAccept = async (course) => {
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
        console.error('Ошибка при вставке в catalogue:', insertError);
        return;
      }

      const { error: deleteError } = await supabase
        .from('suggested_courses')
        .delete()
        .eq('id', course.id);

      if (deleteError) {
        console.error('Ошибка при удалении из suggested_courses:', deleteError);
        return;
      }

      setCourses((prev) => prev.filter((c) => c.id !== course.id));
      setEditingCourse(null);
    } catch (err) {
      console.error('Accept error:', err);
    }
  };

  const handleDecline = async (id) => {
    try {
      const { error } = await supabase
        .from('suggested_courses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Ошибка при удалении:', error);
        return;
      }

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
            <div
              key={course.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem',
                backgroundColor: '#f9f9f9',
              }}
            >
              <h3>{course.title}</h3>
              <p><strong>Teacher:</strong> {course.teacher}</p>
              <p><strong>Language:</strong> {course.language}</p>
              <p><strong>Type:</strong> {course.type}</p>
              <p><strong>Years:</strong> {Array.isArray(course.years) ? course.years.join(', ') : course.years}</p>
              <p><strong>Program:</strong> {Array.isArray(course.program) ? course.program.join(', ') : course.program}</p>
              <p><strong>Description:</strong> {course.description}</p>
              <p><strong>Submitted by:</strong> {course.creator || '—'}</p>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleAccept(course)}
                  style={{ backgroundColor: '#4caf50', color: 'white', padding: '0.5rem 1rem' }}
                >
                  Accept
                </button>
                <button
                  onClick={() => setEditingCourse({ ...course })}
                  style={{ backgroundColor: '#2196f3', color: 'white', padding: '0.5rem 1rem' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDecline(course.id)}
                  style={{ backgroundColor: '#f44336', color: 'white', padding: '0.5rem 1rem' }}
                >
                  Decline
                </button>
              </div>
            </div>
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