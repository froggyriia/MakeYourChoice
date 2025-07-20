// frontend/src/components/CustomToast.jsx
import React from "react";
import { toast } from 'react-hot-toast';
import styles from './CustomToast.module.css';

/**
 * Shows custom confirm notification
 * @param {string} message - Notification text
 * @param {Function} onConfirm - What to do on confirm
 */
export function showConfirm(message, onConfirm) {
    toast.custom((t) => (
        <div className={styles.toastContainer}>
            <p className={styles.toastMessage}>{message}</p>
            <div className={styles.toastButtons}>
                <button
                    className={styles.confirmButton}
                    onClick={() => {
                        toast.remove(t.id);
                        onConfirm();
                    }}
                >
                    Yes
                </button>
                <button
                    className={styles.cancelButton}
                    onClick={() => toast.remove(t.id)}
                >
                    Cancel
                </button>
            </div>
        </div>
    ), {
        duration: Infinity,
        animation: 'none'
    });
}
/**
 * Показывает простое уведомление (auto-close).
 * @param {string} message - Текст уведомления.
 */
export function showNotify(message) {
    toast(message, {
        className: styles.lightToast,
    });
}
