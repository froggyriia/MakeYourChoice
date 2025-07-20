import React, { useEffect, useRef, useState } from 'react';
import Select, {components} from 'react-select';
import {
    saveSemesterInfo,
    getLatestRecordBySemester,
    getSemesterById,
    isSingleActiveSemester,
    isSemesterExists
} from '../api/functions_for_semesters.js';
import { uniquePrograms, fetchCourses } from '../api/functions_for_courses.js';
import addStyles from './AddCourseModal.module.css';
import formStyles from './SemesterForm.module.css';
import { showNotify, showConfirm } from '../components/CustomToast';

const SelectAllMenu = ({ children, ...props }) => {
    const { setValue, options } = props.selectProps;

    const handleSelectAll = () => {
        setValue(options); // выбираем все доступные options
    };

    return (
        <>
            <div
                style={{
                    padding: '8px',
                    borderBottom: '1px solid #ccc',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#40BB20',
                    textAlign: 'center',
                }}
                onClick={handleSelectAll}
            >
                + Select All
            </div>
            <components.MenuList {...props}>{children}</components.MenuList>
        </>
    );
};


const LS_KEY = 'semesterFormData';

export default function SemesterForm({ semesterId, onSave }) {
    // draft from localStorage
    const draft = JSON.parse(localStorage.getItem(LS_KEY) || '{}');

    const [season, setSeason]               = useState(() => draft.season || '');
    const [year, setYear]                   = useState(() => draft.year || new Date().getFullYear());
    const [selectedPrograms, setSelectedPrograms] = useState(() => draft.selectedPrograms || []);
    const [selectedCourses, setSelectedCourses]   = useState(() => draft.selectedCourses || []);
    const [deadline, setDeadline]           = useState(() => draft.deadline || '');
    const [isActive, setIsActive]           = useState(() => draft.isActive ?? false);

    const [programs, setPrograms]           = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);

    // to skip the first season-change effect
    const skipFirstSeasonLoad = useRef(true);

    // ─── 1. Load all programs once ─────────────────────────────────────────────────
    useEffect(() => {
        uniquePrograms().then(setPrograms).catch(console.error);
    }, []);

    // ─── 2. Whenever semesterId changes ───────────────────────────────────────────────
    useEffect(() => {
        skipFirstSeasonLoad.current = true;
        if (!semesterId) {
            // “Add new”: clear to defaults, *and* allow the very next season change to auto-load
            setSeason('');
            setYear('');
            setSelectedPrograms([]);
            setSelectedCourses([]);
            setDeadline('');
            setIsActive(false);

            return;
        }

        // editing existing ⇒ skip the next season-change auto-load

        getSemesterById(semesterId)
            .then(sem => {
                setSeason(sem.semester);
                setYear(sem.semester_year);
                setSelectedPrograms(sem.program);
                setSelectedCourses(sem.courses);
                setDeadline(sem.deadline?.split('T')[0] || '');
                setIsActive(!!sem.is_active);
            })
            .catch(console.error);
    }, [semesterId]);

    // ─── 3. Reload courses when programs change ───────────────────────────────────────
    useEffect(() => {
    if (selectedPrograms.length) {
        fetchCourses(null, true, semesterId)
            .then((courses) => {
                // Преобразуем selectedPrograms в массив объектов {year, program}
                const selectedCombinations = selectedPrograms.map(sp => {
                    const [year, program] = sp.split(' ');
                    return {year, program};
                });

                const filteredCourses = courses.filter(course => {
                    // Проверяем что у курса есть массивы years и programs
                    if (!course.years || !course.program ||
                        !Array.isArray(course.years) ||
                        !Array.isArray(course.program)) {
                        return false;
                    }

                    // Проверяем каждую выбранную комбинацию
                    return selectedCombinations.some(({year, program}) => {
                        // Курс подходит если содержит И год И программу из комбинации
                        return course.years.includes(year) &&
                               course.program.includes(program);
                    });
                });

                setAvailableCourses(filteredCourses);
            })
            .catch(console.error);
    } else {
        setAvailableCourses([]);
        setSelectedCourses([]);
    }
}, [selectedPrograms, semesterId]);

    // ─── 4. Persist draft on every change ────────────────────────────────────────────
    useEffect(() => {
        const toSave = { season, year, selectedPrograms, selectedCourses, deadline, isActive };
        localStorage.setItem(LS_KEY, JSON.stringify(toSave));
    }, [season, year, selectedPrograms, selectedCourses, deadline, isActive]);

    // ─── 5. When *user* changes season (and not skipped), auto-load latest record ─────
    useEffect(() => {
        if (skipFirstSeasonLoad.current) {
            skipFirstSeasonLoad.current = false;
            return;
        }
        if (semesterId) return; // editing an existing record → skip auto-load
        (async () => {
            try {
                const last = await getLatestRecordBySemester(season);
                if (!last) return;
                setYear(last.semester_year);
                setSelectedPrograms(last.program);
                setSelectedCourses(last.courses);
                setDeadline(last.deadline?.split('T')[0] || '');
                setIsActive(!!last.is_active);
            } catch (err) {
                console.error('Failed to load latest semester record:', err);
            }
        })();
    }, [season, semesterId]);


    // ─── Toggle Active/Deactivate immediately ────────────────────────────────────────
    const handleToggleActive = async () => {
        if (!isActive) {
            const existingActive = await isSingleActiveSemester();
            if (existingActive && existingActive.id !== semesterId) {
                showNotify("You cannot activate more than one semester");
                return;
            }

            activateSemester();
        } else {
            showConfirm("Are you sure you want to deactivate this semester?", async () => {
                await activateSemester();
            });
        }
    };

    const activateSemester = async () => {
        const newActive = !isActive;
        await saveSemesterInfo({
            semester: season,
            semester_year: year,
            program: selectedPrograms,
            courses: selectedCourses,
            deadline,
            is_active: newActive
        });

        setIsActive(newActive);
        onSave?.({ id: semesterId, is_active: newActive });

        showNotify(newActive ? "Semester activated" : "Semester deactivated");
    };

    // ─── Full Save (insert/update) ───────────────────────────────────────────────────
    const handleSave = async e => {
        e.preventDefault();

        const exists = await isSemesterExists(season, year);
        if (exists && (!semesterId)) { // если создаём новый семестр, а такой уже есть
            showNotify("Semester with this season and year already exists");
            return;
        }

        if (!season || !year || !selectedPrograms.length || !selectedCourses.length || !deadline) {
            showNotify("Please fill all required fields");
            return;
        }


        const saved = await saveSemesterInfo({
            semester: season,
            semester_year: year,
            program: selectedPrograms,
            courses: selectedCourses,
            deadline,
            is_active: isActive
        });
        localStorage.removeItem(LS_KEY);
        onSave?.(saved[0] || saved);

    };



    return (
        <div className={addStyles.modalContainer}>
            <h2>Semester Info</h2>

            <div className={addStyles.modalContent}>
                <form className={formStyles.form} onSubmit={handleSave}>
                    <select
                        className={formStyles.select}
                        value={season}
                        onChange={e => setSeason(e.target.value)}
                    >
                        <option value="">Select season</option> {/* <-- Добавь плейсхолдер */}
                        {['Fall','Spring','Summer'].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    <label className={formStyles.field}>
                        <span>Year:</span>
                        <input
                            type="number"
                            className={formStyles.input}
                            value={year}
                            onChange={e => setYear(+e.target.value)}
                            placeholder="Select year" // <-- Добавь placeholder
                        />
                    </label>

                    <label className={formStyles.field}>
                        <span>Programs:</span>
                        <Select
                            isMulti
                            options={programs.map(p => ({ label: p, value: p }))}
                            value={selectedPrograms.map(p => ({ label: p, value: p }))}
                            onChange={sel => setSelectedPrograms(sel.map(x => x.value))}
                            components={{ MenuList: SelectAllMenu }}
                            setValue={(newValue) => setSelectedPrograms(newValue.map(o => o.value))}
                            className={formStyles.reactSelect}
                            classNamePrefix="reactSelect"
                        />
                    </label>

                    <label className={formStyles.field}>
                        <span>Available Courses:</span>
                        <Select
                            isMulti
                            options={availableCourses.map(c => ({ label: c.title, value: c.id }))}
                            value={selectedCourses
                                .map(id => {
                                    const c = availableCourses.find(x => x.id === id);
                                    return c ? { label: c.title, value: c.id } : null;
                                })
                                .filter(Boolean)
                            }
                            onChange={sel => setSelectedCourses(sel.map(x => x.value))}
                            components={{ MenuList: SelectAllMenu }}
                            availableCourses={availableCourses} // <-- передаётся в selectProps
                            setValue={(newValue) => setSelectedCourses(newValue.map(o => o.value))} // <-- тоже
                            className={formStyles.reactSelect}
                            classNamePrefix="reactSelect"
                        />

                    </label>

                    <label className={formStyles.field}>
                        <span>Deadline:</span>
                        <input
                            type="date"
                            className={formStyles.input}
                            value={deadline}
                            onChange={e=>setDeadline(e.target.value)}
                        />
                    </label>
                </form>
            </div>

            <div className={addStyles.modalFooter}>
                <button type="button" onClick={handleSave}>
                    Save
                </button>
                <button
                    type="button"
                    onClick={handleToggleActive}
                    className={`${formStyles.toggleButton} ${isActive ? formStyles.active : ''}`}
                >
                    {isActive ? 'Deactivate' : 'Activate'}
                </button>
            </div>
        </div>
    );
}
