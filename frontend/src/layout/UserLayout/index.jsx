import React from 'react';
import Navbar from '@/Components/Navbar';
import styles from './UserLayout.module.css';

export default function UserLayout({ children }){
    return (
        <div className={styles.userLayout}>
            <Navbar />
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}