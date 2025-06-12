import { useState } from 'react';

const CourseItem = ({ course }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="course-item">
            <h2>{course.title}</h2>
            <p>Language: {course.language}</p>
            <p>Program: {course.program}</p>
            <p>Years: {Array.isArray(course.years) ? course.years.join(', ') : 'нет данных'}</p>
            {isOpen && <div className="course-description">{course.description}</div>}
            <button className="btn" onClick={() => setIsOpen(prev => !prev)}>
                {isOpen ? 'Скрыть' : 'Подробнее'}
            </button>
        </div>
    );
};

export default CourseItem;
