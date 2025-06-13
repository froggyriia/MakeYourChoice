import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { addUser, getUsers, findUser, userExists, isAdmin } from '../utils/fakeUserDB.js';
import styles from './LoginPage.module.css';

export default function LoginPage() {
    const { loginAs } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState('signup');
    const [error, setError] = useState('');

    const isInnopolisEmail = (email) => {
        return email.endsWith('@innopolis.university');
    };

    const handleAction = () => {
        setError('');
        if (mode === 'signup') {
            if (!isInnopolisEmail(email)) {
                setError('Email must be from innopolis.university');
                return;
            }

            if (userExists(email)) {
                setError('Email is already registered');
                return;
            }

            const newUser = { email, password };
            addUser(newUser);
            loginAs('student', email);
            navigate('/catalogue');
            console.log(getUsers())
        } else {
            const user = findUser(email, password);
            if (!user) {
                setError('Incorrect password or email');
                return;
            }

            if (isAdmin(email, password)) {
                loginAs('admin', email);
                navigate('/catalogue');
                console.log("admin was logged in");
                console.log(getUsers())
                return;
            }

            loginAs('student', email);
            navigate('/catalogue');
            console.log(getUsers())
        }
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
                <input
                    className={styles.input}
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}

                />
                <div className={styles.modeButtons}>
                    <button
                        onClick={() => setMode('signup')}
                        className={`${styles.modeButton} ${mode === 'signup' ? styles.active : styles.inactive}`}>                        Sign up
                    </button>
                    <button
                        onClick={() => setMode('login')}
                        className={`${styles.modeButton} ${mode === 'login' ? styles.active : styles.inactive}`}>
                        Log in
                    </button>
                </div>
                <button
                    onClick={handleAction}
                className={styles.continueButton}>
                    Continue
                </button>
                {error && <div className={styles.error}>{error}</div>}

        </div>
        </div>
    );
}
