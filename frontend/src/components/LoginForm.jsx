/**
 * LoginForm.jsx
 *
 * A simple login form component for email-based authentication.
 * Accepts an email input, displays errors, and triggers submission when the form is submitted.
 */

import styles from './LoginForm.module.css';

/**
 * LoginForm Component
 *
 * @component
 * @param {Object} props
 * @param {string} props.email - The current email input value.
 * @param {Function} props.setEmail - Function to update the email state.
 * @param {string} props.error - Optional error message to display.
 * @param {Function} props.onSubmit - Callback function to handle form submission.
 * @returns {JSX.Element}
 */
export default function LoginForm({ email, setEmail, error, onSubmit }) {
    /**
     * Handles the form submission event.
     * Prevents default form behavior and calls the provided `onSubmit` callback.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
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