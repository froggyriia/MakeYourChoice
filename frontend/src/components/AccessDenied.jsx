import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AccessDenied.module.css';

const AccessDenied = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setTimeout(() => navigate('/login'), 10000);
        const interval = setInterval(() => setCountdown(prev => prev - 1), 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [navigate]);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.catContainer}>
                    <svg className={styles.sadCat} viewBox="0 0 512 512">
                        {/* Голова кота */}
                        <circle cx="256" cy="256" r="200" fill="#333"/>

                        {/* Уши */}
                        <path d="M150,120 L200,180 L130,170 Z" fill="#333"/>
                        <path d="M362,120 L312,180 L382,170 Z" fill="#333"/>

                        {/* Глаза */}
                        <circle cx="200" cy="220" r="30" fill="#22C55E"/>
                        <circle cx="310" cy="220" r="30" fill="#22C55E"/>
                        <circle cx="200" cy="220" r="15" fill="#000"/>
                        <circle cx="310" cy="220" r="15" fill="#000"/>

                        {/* Нос и рот */}
                        <path d="M255,260 L255,280" stroke="#fff" strokeWidth="3"/>
                        <path d="M255,280 Q235,300 215,290" stroke="#fff" strokeWidth="3" fill="none"/>

                        {/* Усики */}
                        <path d="M220,250 L180,230" stroke="#fff" strokeWidth="2"/>
                        <path d="M220,260 L180,260" stroke="#fff" strokeWidth="2"/>
                        <path d="M220,270 L180,290" stroke="#fff" strokeWidth="2"/>
                        <path d="M290,250 L330,230" stroke="#fff" strokeWidth="2"/>
                        <path d="M290,260 L330,260" stroke="#fff" strokeWidth="2"/>
                        <path d="M290,270 L330,290" stroke="#fff" strokeWidth="2"/>
                    </svg>
                </div>

                <h1 className={styles.title}>Access Denied</h1>
                <p className={styles.message}>
                    You don't have permission to access this page right now.
                    <br />
                    Possible reasons:
                </p>
                <ul className={styles.message}>
                    <li>Voting period hasn't started yet</li>
                    <li>Voting period has ended</li>
                    <li>Your account doesn't have student privileges</li>
                </ul>

                <div className={styles.buttonGroup}>
                    <button
                        className={styles.buttonSecondary}
                        onClick={() => window.history.back()}
                    >
                        Go back
                    </button>
                    <button
                        className={styles.buttonPrimary}
                        onClick={() => navigate('/login')}
                    >
                        Log in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;