import React from "react";
import '../styles/CourseFormPage.css'
import mockCourses from '../utils/fakeCoursesDB.js';

export default function ElectivesForm({ type }) {
    return (
        <form>
            <h2> {type === 'tech' ? 'Technical Electives' : 'Humanities Electives'}</h2>
            {[[...Array(5)].map((_, i) => (
                <div key = {i} className="priority-group">
                    <label className="priority-label">Priority {i + 1}</label>
                    <select className="priority-select" defaultValue="">
                        <option value="" disabled>
                            Select course
                        </option>

                        {/* остальные <option> */}
                    </select>
                </div>
            ))]}
            <button className="submit-button">Submit</button>
        </form>
    );
}