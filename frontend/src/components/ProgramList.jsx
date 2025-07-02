/**
 * ProgramList.jsx
 *
 * This component renders a list of student programs.
 * It uses the ProgramItem component to display each program, providing delete and edit handlers.
 */

import ProgramItem from './ProgramItem';
import styles from './CourseList.module.css'
/**
 * ProgramList Component
 *
 * @component
 * @param {Object} props
 * @param {Array} props.programs - Array of program objects
 * @param {Function} props.onDeleteProgram - Callback to handle deletion of a program
 * @param {Function} props.onEditProgram - Callback to handle editing of a program
 * @returns {JSX.Element}
 */
const ProgramList = ({ programs, onDeleteProgram, onEditProgram }) => {
    console.log("[ProgramList] rendering programs:", programs);
    return (
        <div>
            {programs.length ? (
                programs.map((program) => (
                    <ProgramItem
                        key={program.student_group}
                        program={program}
                        onDelete={onDeleteProgram}
                        onEdit={onEditProgram}
                    />
                ))
            ) : (
                <p>No student programs available</p>
            )}
        </div>
    );
};

export default ProgramList;
