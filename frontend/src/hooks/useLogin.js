// hooks/useLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isInnopolisEmail, isAdmin } from '../utils/validation';

export const useLogin = () => {
    const { loginAs } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        setError('');
        if (!isInnopolisEmail(email)) {
            setError('Email must be from innopolis.university');
            return;
        }

        const role = isAdmin(email) ? 'admin' : 'student';
        loginAs(role, email);
        navigate('/catalogue');
    };

    return {
        email,
        setEmail,
        error,
        handleLogin,
    };
};
