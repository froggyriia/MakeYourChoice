/**
 * AdminSuggestedPage
 *
 * Placeholder for suggested courses management page.
 * You can extend this to include suggested electives review/approval later.
 */

import styles from './CataloguePage.module.css';

const AdminSuggestedPage = () => {
    return (
        <div className={styles.headerContainer}>
            <h2 className={styles.titleContainer}>Suggested Courses</h2>

            {/* Здесь будет список предложенных курсов или логика модалки */}
            <p style={{ padding: '16px' }}>
                This page is under construction. Suggested electives will be managed here.
            </p>
        </div>
    );
};

export default AdminSuggestedPage;