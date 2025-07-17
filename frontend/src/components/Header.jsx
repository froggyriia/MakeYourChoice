import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCatalogueContext } from '../context/CatalogueContext.jsx';
import styles from './Header.module.css';
import { getUserProgram } from '../api/functions_for_users.js';
import { getDeadlineForGroup } from '../api/functions_for_programs.js';

export default function Header() {
  const { email, logout, trueRole, currentRole, setCurrentRole } = useAuth();
  const navigate = useNavigate();
  const { catalogue, excelExport } = useCatalogueContext();

  const [deadline, setDeadline] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Click outside to close menu
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch deadline for student
  useEffect(() => {
    const fetchDeadline = async () => {
      if (!email || currentRole === 'admin') return;
      const group = await getUserProgram(email);
      const ts = await getDeadlineForGroup(group);
      if (ts) {
        const formatted = new Date(ts).toLocaleString('en-GB', {
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit',
        });
        setDeadline(formatted);
      }
    };
    fetchDeadline();
  }, [email, currentRole]);

  if (!email) return null;

  return (
    <header className={styles.header}>
      <nav className={styles.navLinks}>
        {currentRole === 'admin' && (
          <>
            <NavLink to="/admin/suggested_courses" className={({ isActive }) =>
              isActive ? `${styles.navBtn} ${styles.activeBtn}` : styles.navBtn}>
              Suggested Courses
            </NavLink>
            <NavLink to="/admin/courses" className={({ isActive }) =>
              isActive ? `${styles.navBtn} ${styles.activeBtn}` : styles.navBtn}>
              Courses
            </NavLink>
            <NavLink to="/admin/programs" className={({ isActive }) =>
              isActive ? `${styles.navBtn} ${styles.activeBtn}` : styles.navBtn}>
              Programs
            </NavLink>
            <NavLink to="/admin/semesters" className={({ isActive }) =>
              isActive ? `${styles.navBtn} ${styles.activeBtn}` : styles.navBtn}>
              Semesters
            </NavLink>
          </>
        )}
      </nav>

      <div className={styles.headerRight}>
        {currentRole === 'student' && deadline && (
          <span className={styles.deadline}>⏰ Deadline: {deadline}</span>
        )}

        <span className={styles.email}>{email}</span>

        <div className={styles.userMenuWrapper} ref={menuRef}>
          <button className={styles.menuButton} onClick={() => setMenuOpen(p => !p)}>▾</button>
          {menuOpen && (
            <div className={styles.dropdown}>
              {currentRole === 'admin' && (
                <button className={styles.exstButton} onClick={excelExport.exportToExcel}>
                  <img width="16" height="16" src="https://img.icons8.com/ios/50/ms-excel.png" alt="ms-excel"/> {excelExport.isExported ? 'Exported!' : 'Export to Excel'}
                </button>
              )}
              {trueRole === 'admin-student' && (
                <button className={styles.exstButton} onClick={() => {
                  const newRole = currentRole === 'admin' ? 'student' : 'admin';
                  setCurrentRole(newRole);
                  navigate(newRole === 'admin' ? '/admin/courses' : '/student-catalogue');
                }}>
                  <img width="16" height="16" src="https://img.icons8.com/material-outlined/24/student-male.png" alt="student-male"/>
                  {currentRole === 'admin' ? 'View as Student' : 'Back to Admin'}
                </button>
              )}
              <button className={styles.logoutButton} onClick={logout}>
                <img width="16" height="16" src="https://img.icons8.com/material-outlined/24/exit.png" alt="exit"/> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
