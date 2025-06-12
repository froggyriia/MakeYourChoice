import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { addUser, getUsers, findUser, userExists, isAdmin } from '../utils/fakeUserDB.js';
import '../styles/global.css';

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
        <div className="login-page">
            <div className="login-card">
                <h2 className="login-title">Welcome!</h2>
                <input
                    type="email"
                    placeholder="email@innopolis.university"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                />
                <div className="login-button-row">
                    <button
                        onClick={() => setMode('signup')}
                        className="login-button"
                        style={{ backgroundColor: mode === 'signup' ? '#32CD32' : '#a0a0a0' }}
                    >
                        Sign up
                    </button>
                    <button
                        onClick={() => setMode('login')}
                        className="login-button"
                        style={{ backgroundColor: mode === 'login' ? '#32CD32' : '#a0a0a0' }}
                    >
                        Log in
                    </button>
                </div>
                <button
                    onClick={handleAction}
                    className="login-button login-continue"
                >
                    Continue
                </button>
                {error && <div className="login-error">{error}</div>}
            </div>
        </div>
    );
}
