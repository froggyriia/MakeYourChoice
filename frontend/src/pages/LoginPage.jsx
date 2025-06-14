// pages/LoginPage.jsx
import React from "react";
import { useLogin } from '../hooks/useLogin';
import LoginForm from '../components/LoginForm';
import styles from './LoginPage.module.css';

export default function LoginPage() {
    const { email, setEmail, error, handleLogin } = useLogin();

    return (
        <div className={styles.wrapper}>
            <LoginForm
                email={email}
                setEmail={setEmail}
                error={error}
                onSubmit={handleLogin}
            />
        </div>
    );
}
