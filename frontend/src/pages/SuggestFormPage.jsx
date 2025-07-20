import React from "react";
import { useRef, useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import AddCourseModal from '../components/AddCourseModal';
import { useCatalogueContext } from '../context/CatalogueContext';
import { supabase } from '../pages/supabaseClient.jsx';
import { showNotify } from '../components/CustomToast';
import styles from './SuggestFormPage.module.css'; // Добавьте этот импорт

const SuggestFormPage = () => {
  const scrollPosition = useRef(0);
  const recaptchaRef = useRef(null);
  const formRef = useRef(null);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const {
    catalogue: {
      currentCourse,
      handleChange,
      handleYearsChange,
      handleCancel,
      setCourses,
      courses,
      startAddingCourse,
    }
  } = useCatalogueContext();

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleContinue = () => {
    if (!fullName.trim()) {
      setMessage('Please enter your name');
      return;
    }
    if (!recaptchaToken) {
      setMessage('r u alex potyomkin?...');
      return;
    }
    setMessage('');
    startAddingCourse();
    setTimeout(() => {
      handleChange('title', '');
      handleChange('description', '');
      handleChange('teacher', '');
      handleChange('language', '');
      handleChange('type', '');
      handleChange('years', '');
      handleChange('program', '');
      handleChange('archived', false);
      handleChange('is_declined', false);
    }, 0);

    setStep(2);
  };

  // Обработчик нажатия клавиш
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleContinue();
    }
  };

  useEffect(() => {
    const formElement = formRef.current;
    if (formElement) {
      formElement.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (formElement) {
        formElement.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [fullName, recaptchaToken]);

  const handleSubmit = async () => {
    const newCourse = {
      title: currentCourse.title,
      description: currentCourse.description,
      teacher: currentCourse.teacher,
      language: currentCourse.language,
      type: currentCourse.type,
      years: currentCourse.years,
      program: currentCourse.program,
      creator: fullName,
      archived: false,
      is_declined: false,
    };

    const { data, error } = await supabase
        .from('suggested_courses')
        .insert([newCourse]);

    console.log('📦 newCourse:', newCourse);
    console.log('✅ data:', data);
    console.log('⚠️ error:', error);

    if (!error) {
      setCourses([...courses, ...(data || [])]);
      showNotify("Your course suggestion was submitted successfully!");
      handleCancel();
      setStep(1);
      setFullName('');
      setRecaptchaToken(null);
      if (recaptchaRef.current) recaptchaRef.current.reset();
    } else {
      console.error('Error from Supabase:', error);
      showNotify("Error while adding course: " + error.message);
    }
  };


  const handleModalCancel = () => {
    handleCancel();
    setStep(1);
    setMessage('');
    setFullName('');
    setRecaptchaToken(null);
    if (recaptchaRef.current) recaptchaRef.current.reset();
    window.scrollTo(0, scrollPosition.current);
  };

  return (
    <div className={styles.container} ref={formRef}> {/* Добавлен ref к форме */}
      {step === 1 && (
        <>
          <h2 className={styles.title}>Enter your name</h2>
          <label className={styles.label}>
            Name:
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.input}
              onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
            />
          </label>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LeAKX0rAAAAABHyEWK7mJr9_RjtXi1q4piqOa5y"
            onChange={handleRecaptchaChange}
            className={styles.recaptcha}
          />
          <button
            onClick={handleContinue}
            className={styles.button}
          >
            Next
          </button>
        </>
      )}

      {step === 2 && currentCourse && (
        <AddCourseModal
          course={currentCourse}
          onChange={handleChange}
          onToggleYear={handleYearsChange}
          onSubmit={handleSubmit}
          onCancel={handleModalCancel}
          isStandAlone={true}
        />
      )}

      {message && (
        <p className={`${styles.message} ${
          message.includes('Error') ? styles.error : styles.success
        }`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default SuggestFormPage;