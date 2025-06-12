import { useState } from 'react';
import SidebarMenu from '../components/SidebarMenu';
import HumElectivesForm from '../components/ElectivesForm';
import '../styles/CourseFormPage.css';
import ElectivesForm from "../components/ElectivesForm";

export default function CourseFormPage() {
    const [activeTab, setActiveTab] = useState('tech');

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
                <ElectivesForm type={activeTab} />
            </div>

        </div>
    );
}




