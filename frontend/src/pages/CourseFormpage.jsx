import { useState } from 'react';
import SidebarMenu from '../components/SidebarMenu';
import HumElectivesForm from '../components/ElectivesForm';
import '../styles/CourseFormPage.css';
import ElectivesForm from "../components/ElectivesForm";
import studentsPreferences from "../utils/students_pref.js";
import {useAuth} from "../context/AuthContext.jsx";

export default function CourseFormPage() {
    const { email } = useAuth();
    const [activeTab, setActiveTab] = useState('tech');
    const onSubmit = (selectedCourses) => {

        console.log("Submitted courses:", selectedCourses);
        let student = studentsPreferences.find(s => s.email === email);
        if (!student) {
            student = { email, hum: [], tech: [] };
            studentsPreferences.push(student);
        }
        student[activeTab] = selectedCourses;
        console.log("Updated studentsPreferences:", studentsPreferences);

    }
    return(
        <div className="form-container">
            <SidebarMenu />
            <div className="form-content">
                <div className="tabs">
                    <button
                        className={`tab-button ${activeTab === 'hum' ? 'active' : 'inactive'}`}
                        onClick={() => setActiveTab('hum')}>
                        Hum
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'tech' ? 'active' : 'inactive'}`}
                        onClick={() => setActiveTab('tech')}>
                        Tech
                    </button>
                </div>
                <h1 className="form-title">Course Form</h1>
                <ElectivesForm type={activeTab} onSubmit={onSubmit}/>
            </div>

        </div>
    );
}




