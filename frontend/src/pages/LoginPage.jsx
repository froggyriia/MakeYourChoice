import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { addUser, getUsers, userExists, isAdmin } from '../utils/fakeUserDB.js';
import styles from './LoginPage.module.css';

export default function LoginPage() {
    const { loginAs } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const isInnopolisEmail = (email) => email.endsWith('@innopolis.university');

    const handleContinue = () => {
        setError('');

        if (!isInnopolisEmail(email)) {
            setError('Email must be from innopolis.university');
            return;
        }

        const exists = userExists(email);

        if (!exists) {
            addUser({ email });
        }

        if (isAdmin(email)) {
            loginAs('admin', email);
        } else {
            loginAs('student', email);
        }

        navigate('/catalogue');
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <h2 className={styles.title}>Welcome!</h2>

                <input
                    className={styles.input}
                    type="email"
                    placeholder="email@innopolis.university"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    onClick={handleContinue}
                    className={styles.continueButton}
                >
                    Continue
                </button>

                {error && <div className={styles.error}>{error}</div>}
            </div>
        </div>
    );
}
