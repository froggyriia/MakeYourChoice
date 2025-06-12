import React, { useState } from 'react';

const VotingForm = ({ courses, onSubmit, onReturnToCatalogue }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comments: '',
    priorities: {}
  });
  const [submitted, setSubmitted] = useState(false);
  const [usedPriorities, setUsedPriorities] = useState(new Set());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (courseId, value) => {
    const newPriorities = { ...formData.priorities };
    const previousValue = newPriorities[courseId];
    
    // Обновляем список использованных приоритетов
    const newUsedPriorities = new Set(usedPriorities);
    
    if (previousValue) {
      newUsedPriorities.delete(previousValue);
    }
    
    if (value) {
      newUsedPriorities.add(value);
    }

    setUsedPriorities(newUsedPriorities);
    setFormData(prev => ({
      ...prev,
      priorities: {
        ...prev.priorities,
        [courseId]: value
      }
    }));
  };

  const isPriorityAvailable = (priority) => {
    return !usedPriorities.has(priority.toString()) || priority === '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Проверяем, что все курсы имеют уникальные приоритеты
    const priorities = Object.values(formData.priorities);
    const uniquePriorities = new Set(priorities.filter(p => p));
    
    if (uniquePriorities.size !== priorities.filter(p => p).length) {
      alert('Please assign unique priorities to each course');
      return;
    }
    
    if (priorities.length !== courses.length || priorities.some(p => !p)) {
      alert('Please assign priorities to all courses');
      return;
    }
    
    onSubmit(formData);
    setSubmitted(true);
  };

  const resetForm = () => {
    onReturnToCatalogue();
  };

  if (submitted) {
    return (
      <div className="thank-you-message">
        <h3>Thank you for your vote!</h3>
        <p>Your preferences have been recorded.</p>
        <button 
          id="new-vote-btn"
          onClick={resetForm}
        >
          Return to Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Vote for Courses You Want to Study</h2>
      <p>Please rank the courses below by priority (1 - highest priority):</p>
      
      <form id="voting-form" onSubmit={handleSubmit}>
        <div id="courses-list" className="courses-list">
          {courses.map(course => (
            <div key={course.id} className="course-item">
              <div className="course-info">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>
              <select
                className="priority-select"
                value={formData.priorities[course.id] || ''}
                onChange={(e) => handlePriorityChange(course.id, e.target.value)}
                required
              >
                <option value="">Clean</option>
                {Array.from({ length: courses.length }, (_, i) => (
                  <option 
                    key={i+1} 
                    value={i+1}
                    disabled={!isPriorityAvailable(i+1) && formData.priorities[course.id] !== (i+1).toString()}
                  >
                    {i+1}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        
        <div className="form-group">
          <label htmlFor="name">Your Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="comments">Additional Comments:</label>
          <textarea
            id="comments"
            name="comments"
            rows="4"
            value={formData.comments}
            onChange={handleChange}
          ></textarea>
        </div>
        
        <button type="submit" className="submit-btn">Submit Vote</button>
      </form>
    </div>
  );
};

export default VotingForm;