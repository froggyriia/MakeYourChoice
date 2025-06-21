// components/LoginForm.jsx
import styles from './LoginForm.module.css';

export default function LoginForm({ email, setEmail, error, onSubmit }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            <h2 className={styles.title}>Welcome!</h2>

            <input
                className={styles.input}
                type="email"
                placeholder="email@innopolis.university"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit" className={styles.continueButton}>
                Continue
            </button>

            {error && <div className={styles.error}>{error}</div>}
        </form>
    );
}