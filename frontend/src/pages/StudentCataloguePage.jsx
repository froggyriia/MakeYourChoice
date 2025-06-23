import { useRef } from 'react';
import Header from '../components/Header';
import CourseList from '../components/CourseList';
import ElectivesForm from '../components/ElectivesForm';
import { useCatalogueContext } from '../context/CatalogueContext.jsx';
import { useAuth } from '../context/AuthContext';
import { useFormSubmit } from '../hooks/useFormSubmit';
import styles from './CataloguePage.module.css';

const StudentCataloguePage = () => {
    const { role, email } = useAuth();
    const { catalogue } = useCatalogueContext();
    const { onSubmit } = useFormSubmit(email);
    const scrollPosition = useRef(0);

    const {
        courses,
        courseTypeFilter,
    } = catalogue;

    if (role === 'admin') return <p>Access denied</p>;

    return (
        <>
            <Header />

            <div className={styles.pageWrapper}>
                <div className={styles.leftSection}>
                    <CourseList courses={courses} />
                </div>

                <div className={styles.rightSection}>
                    <ElectivesForm
                        type={courseTypeFilter}
                        onSubmit={(selectedCourses) => onSubmit(selectedCourses, courseTypeFilter)}
                    />
                </div>
            </div>
        </>
    );
};

export default StudentCataloguePage;
