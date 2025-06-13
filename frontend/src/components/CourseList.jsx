import CourseItem from './CourseItem';

const CourseList = ({ courses, onDeleteCourse }) => {
    return (
        <div>
            {courses.length ? (
                courses.map((course) => (
                    <CourseItem
                        key={course.id}
                        course={course}
                        onDelete={onDeleteCourse}
                    />
                ))
            ) : (
                <p>No available courses</p>
            )}
        </div>
    );
};

export default CourseList;