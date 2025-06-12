import React from 'react';

const CourseCard = ({ course, isFavorite, onToggleFavorite, onSeeMore }) => {
  return (
    <div className="course-card">
      <h2>{course.title}</h2>
      <p>Language: {course.language}</p>
      <p>Program: {course.program}</p>
      <p>Year: {course.year}</p>
      <p className="description">{course.description}</p>
      <button 
        className="see-more" 
        onClick={() => onSeeMore(course)}
      >
        See more ▶
      </button>
      <svg 
        className="star" 
        width="30" 
        height="30" 
        viewBox="0 0 24 24"
        onClick={() => onToggleFavorite(course.id)}
      >
        <path 
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" 
          fill={isFavorite ? 'green' : 'white'} 
          stroke="green" 
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
};

export default CourseCard;