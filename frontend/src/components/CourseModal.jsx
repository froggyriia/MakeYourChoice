import React from 'react';

const CourseModal = ({ course, onClose }) => {
  if (!course) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button 
          className="close-modal"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 id="modal-title">{course.title}</h2>
        <div className="modal-info">
          <p><strong>Language:</strong> <span id="modal-language">{course.language}</span></p>
          <p><strong>Program:</strong> <span id="modal-program">{course.program}</span></p>
          <p><strong>Year:</strong> <span id="modal-year">{course.year}</span></p>
          <p><strong>Description:</strong> <span id="modal-description">{course.description}</span></p>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;