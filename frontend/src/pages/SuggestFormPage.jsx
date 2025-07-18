import { useRef, useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import AddCourseModal from '../components/AddCourseModal';
import { useCatalogueContext } from '../context/CatalogueContext';
import { supabase } from '../pages/supabaseClient.jsx';

const SuggestFormPage = () => {
  const scrollPosition = useRef(0);
  const recaptchaRef = useRef(null);
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
      setMessage('Successfully submitted!');
      handleCancel();
      setStep(1);
      setFullName('');
      setRecaptchaToken(null);
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setTimeout(() => setMessage(''), 3000);
    } else {
      console.error('Error from Supabase:', error);
      setMessage('Error while adding');
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
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '16px' }}>
      {step === 1 && (
        <>
          <h2 style={{ color: 'green' }}>Enter your name</h2>
          <label style={{ display: 'block', marginBottom: '12px' }}>
            Name:
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '4px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </label>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LeAKX0rAAAAABHyEWK7mJr9_RjtXi1q4piqOa5y"
            onChange={handleRecaptchaChange}
            style={{ marginBottom: '16px' }}
          />
          <button
            onClick={handleContinue}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
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
        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          fontWeight: 'bold',
          color: message.includes('Ошибка') ? 'red' : 'green',
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default SuggestFormPage;
