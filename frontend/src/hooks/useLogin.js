// useLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isInnopolisEmail } from '../hooks/validation';

export const useLogin = () => {
    const { loginAs } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!isInnopolisEmail(email)) {
            setError('Email must be from innopolis.university');
            return;
        }

        const resolvedRole = await loginAs(email);

        if (resolvedRole === 'admin') {
            navigate('/admin');
        } else {
            navigate('/student-catalogue');
        }
    };

    return {
        email,
        setEmail,
        error,
        handleLogin
    };
};
