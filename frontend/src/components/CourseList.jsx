//CourseList.jsx

import CourseItem from './CourseItem';

const CourseList = ({ courses, onDeleteCourse, onEditCourse }) => {
    return (
        <div>
            {courses.length ? (
                courses.map((course) => (
                    <CourseItem
                        key={course.id}
                        course={course}
                        onDelete={onDeleteCourse}
                        onEdit={onEditCourse}
                    />
                ))
            ) : (
                <p>No available courses</p>
            )}
        </div>
    );
};

export default CourseList;