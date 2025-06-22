/**
 * LoginPage.jsx
 *
 * This page provides the login interface for users.
 * It handles user authentication by validating the email and assigning the correct role.
 *
 * Data/Function Flow:
 * - Hooks:
 *   - `useLogin()` manages login logic: handles state for email, validation errors, and login submission.
 * - Components:
 *   - `LoginForm` is a reusable form component that renders the input and login button.
 * - Styling:
 *   - Uses CSS module styles from `LoginPage.module.css`.
 */

import React from "react";
import { useLogin } from '../hooks/useLogin'; // Custom hook that encapsulates login logic
import LoginForm from '../components/LoginForm'; // Reusable form component
import styles from './LoginPage.module.css'; // Scoped styles for the login page

/**
 * LoginPage component renders the login screen and handles authentication logic.
 *
 * @returns {JSX.Element} The rendered login page.
 */
export default function LoginPage() {
    // Destructure login-related values and functions from useLogin hook
    const { email, setEmail, error, handleLogin } = useLogin();

    return (
        <div className={styles.wrapper}>
            {/* LoginForm handles user input and submission */}
            <LoginForm
                email={email}           // Controlled input value
                setEmail={setEmail}     // Updates email state
                error={error}           // Validation error to display if email is invalid
                onSubmit={handleLogin}  // Login handler called on form submit
            />
        </div>
    );
}
