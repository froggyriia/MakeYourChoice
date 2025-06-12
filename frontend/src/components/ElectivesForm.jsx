import React, {useState} from "react";
import '../styles/CourseFormPage.css'
import mockCourses from '../utils/fakeCoursesDB.js';
import students_pref from "../utils/students_pref.js";

export default function ElectivesForm({ type }) {
    const filteredCourses = mockCourses.filter(course => course.type === type);

    const [selectedCourses, setSelectedCourses] = useState(Array(5).fill(""));

    const handleChange = (index, value) => {
        const updated = [...selectedCourses];
        updated[index] = value;
        setSelectedCourses(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const result = {}
    }

    return (
        <form>
            <h2> {type === 'tech' ? 'Technical Electives' : 'Humanities Electives'}</h2>

            {[...Array(5)].map((_, i) => {
                const usedCoursesIDs = selectedCourses.filter((_, idx) => i !== idx);

                const availableCourses = filteredCourses.filter(
                    course => !usedCoursesIDs.includes(String(course.id))
                );

                return (
                    <div key={i} className="priority-group">
                        <label className="priority-label">Priority {i + 1}</label>
                        <select
                            className="priority-select"
                            value={selectedCourses[i]}
                            onChange={(e) => handleChange(i, e.target.value)}
                        >
                            <option value="" disabled>
                                Select course
                            </option>
                            {availableCourses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>
                );

            })}
            <button className="submit-button" type="submit">Submit</button>
        </form>
    );
}