/**
 * useLogin.js
 *
 * This custom React hook handles login logic for users in the system.
 * It validates the user's email, assigns a role (admin or student),
 * updates authentication state, and redirects to the catalogue page.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isInnopolisEmail, isAdmin } from '../utils/validation';

/**
 * Hook that manages login form logic, including validation, role detection,
 * setting auth state, and redirecting on success.
 *
 * @returns {{
 *   email: string,
 *   setEmail: (string) => void,
 *   error: string,
 *   handleLogin: () => void
 * }}
 */
export const useLogin = () => {
    const { loginAs } = useAuth(); // AuthContext method to set user role and email
    const navigate = useNavigate(); // React Router hook for navigation
    const [email, setEmail] = useState(''); // User email input
    const [error, setError] = useState(''); // Error message to display to user


    /**
     * Validates email, sets role (admin or student), and redirects on success.
     * Shows error if email is invalid.
     */
    const handleLogin = () => {
        setError('');
        // Validate that the email is from the allowed domain
        if (!isInnopolisEmail(email)) {
            setError('Email must be from innopolis.university');
            return;
        }

        // Determine the user's role based on the email
        const role = isAdmin(email) ? 'admin' : 'student';
        loginAs(role, email);
        // Redirect to the main catalogue page
        navigate('/catalogue');
    };

    return {
        email,
        setEmail,
        error,
        handleLogin,
    };
};
