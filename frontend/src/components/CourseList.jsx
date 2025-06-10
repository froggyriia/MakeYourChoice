import CourseItem from './CourseItem';

const CourseList = ({ courses }) => {
    return (
        <div>
            {courses.length
                ? courses.map(course => <CourseItem key={course.id} course={course} />)
                : <p>Нет доступных курсов</p>}
        </div>
    );
};

export default CourseList;
