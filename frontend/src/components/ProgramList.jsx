// components/ProgramList.jsx

import ProgramItem from './ProgramItem';

const ProgramList = ({ programs, onDeleteProgram, onEditProgram }) => {
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
