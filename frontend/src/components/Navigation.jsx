import React from 'react';

const Navigation = ({ currentView, setCurrentView, isMobileMenuOpen, toggleMobileMenu }) => {
  const handleNavClick = (view) => {
    setCurrentView(view);
    if (isMobileMenuOpen) toggleMobileMenu();
  };

  return (
    <>
      <button 
        className="menu-toggle"
        onClick={toggleMobileMenu}
        aria-expanded={isMobileMenuOpen}
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>
      
      <nav 
        className={`menu ${isMobileMenuOpen ? 'visible' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <h2>Menu</h2>
        <a 
          href="#catalogue" 
          className={currentView === 'catalogue' ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('catalogue');
          }}
          aria-current={currentView === 'catalogue' ? 'page' : undefined}
        >
          Course Catalogue
        </a>
        <a 
          href="#mycourses" 
          className={currentView === 'mycourses' ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('mycourses');
          }}
          aria-current={currentView === 'mycourses' ? 'page' : undefined}
        >
          My Courses
        </a>
        <a 
          href="#voting" 
          className={currentView === 'form' ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('form');
          }}
          aria-current={currentView === 'form' ? 'page' : undefined}
        >
          Course Voting
        </a>
      </nav>
    </>
  );
};

export default Navigation;