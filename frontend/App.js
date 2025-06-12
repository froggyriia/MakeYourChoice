import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import CourseCard from './components/CourseCard';
import VotingForm from './components/VotingForm';
import CourseModal from './components/CourseModal';

const App = () => {
  // Состояния приложения
  const [currentView, setCurrentView] = useState('catalogue');
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Intro into Robotics",
      language: "Russian",
      program: "English",
      year: "1",
      description: "Fundamentals of robotics and automation systems.",
      isFavorite: false
    },
    {
      id: 2,
      title: "Intro into Flutter",
      language: "English",
      program: "English",
      year: "1 - 2",
      description: "Mobile app development with Flutter framework.",
      isFavorite: false
    },
    {
      id: 3,
      title: "Data Structures",
      language: "English",
      program: "Computer Science",
      year: "2",
      description: "Advanced data structures and algorithms.",
      isFavorite: false
    }
  ]);
  const [favorites, setFavorites] = useState([]);
  const [votes, setVotes] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Загрузка данных из localStorage при монтировании
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const savedVotes = JSON.parse(localStorage.getItem('votes')) || [];
    setFavorites(savedFavorites);
    setVotes(savedVotes);
  }, []);

  // Управление мобильным меню
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Работа с избранными курсами
  const toggleFavorite = (courseId) => {
    const newFavorites = favorites.includes(courseId)
      ? favorites.filter(id => id !== courseId)
      : [...favorites, courseId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  // Обработка голосования
  const handleVoteSubmit = (voteData) => {
    // Проверка уникальности приоритетов
    const priorities = Object.values(voteData.priorities);
    const uniquePriorities = new Set(priorities);
    
    if (uniquePriorities.size !== priorities.length) {
      alert('Error: Duplicate priorities found. Please assign unique priorities to each course.');
      return;
    }

    const newVotes = [...votes, {
      ...voteData,
      timestamp: new Date().toISOString()
    }];
    
    setVotes(newVotes);
    localStorage.setItem('votes', JSON.stringify(newVotes));
  };

  // Управление модальным окном
  const showCourseDetails = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
    closeMobileMenu();
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  // Навигация
  const returnToCatalogue = () => {
    setCurrentView('catalogue');
    closeMobileMenu();
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    closeMobileMenu();
  };

  // Фильтрация курсов для текущего вида
  const coursesToShow = currentView === 'catalogue' 
    ? courses 
    : courses.filter(course => favorites.includes(course.id));

  return (
    <div className="container">
      {/* Навигация с мобильным меню */}
      <Navigation 
        currentView={currentView} 
        setCurrentView={handleViewChange}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
      
      {/* Основное содержимое */}
      <div className="main">
        <h1 id="page-title">
          {currentView === 'catalogue' ? 'Course Catalogue' : 
           currentView === 'mycourses' ? 'My Courses' : 'Course Voting'}
        </h1>
        
        {/* Рендеринг соответствующего контента */}
        {currentView !== 'form' ? (
          <div id="courses-container">
            {coursesToShow.length === 0 ? (
              <div className="empty-state">
                {currentView === 'catalogue' 
                  ? 'No courses available' 
                  : 'You have no favorite courses yet. Add some from the Course Catalogue!'}
              </div>
            ) : (
              coursesToShow.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isFavorite={favorites.includes(course.id)}
                  onToggleFavorite={toggleFavorite}
                  onSeeMore={showCourseDetails}
                />
              ))
            )}
          </div>
        ) : (
          <VotingForm 
            courses={courses} 
            onSubmit={handleVoteSubmit}
            onReturnToCatalogue={returnToCatalogue}
          />
        )}
      </div>

      {/* Модальное окно с деталями курса */}
      {showModal && (
        <CourseModal 
          course={selectedCourse}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default App;