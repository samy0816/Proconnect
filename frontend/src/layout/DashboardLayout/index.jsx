import React, { useEffect } from 'react';
import styles from './index.module.css';
import { useRouter } from 'next/router';
import { setTokenIsthere } from '@/config/redux/action/middleware/reducer/Authreducer';
import { useDispatch, useSelector } from 'react-redux';
import { FaNewspaper, FaUsers, FaUserPlus, FaArrowRight } from 'react-icons/fa';
import { getAvatarUrl } from '@/utils/avatar';

export default function DashboardLayout({ children }) {
    const authState = useSelector((state) => state.auth);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (authState.isDemo) return; // Demo mode: skip auth guard
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        dispatch(setTokenIsthere());
    }, [router, dispatch, authState.isDemo]);

    return (
        <div className={styles.layoutContainer}>
            {/* Profile Hero Banner — spans the full width */}
            <div className={styles.profileHero}>
                <div className={styles.heroLeft}>
                    <img
                        src={getAvatarUrl(authState.user?.name || 'User', 96)}
                        alt="Profile"
                        className={styles.heroAvatar}
                        onClick={() => router.push('/profile')}
                    />
                    <div className={styles.heroInfo}>
                        <h3 className={styles.heroName}>{authState.user?.name}</h3>
                        <p className={styles.heroTitle}>{authState.profile?.currentPost || 'Web Developer'}</p>
                        <span className={styles.heroUsername}>@{authState.user?.username}</span>
                    </div>
                </div>
                <div className={styles.heroRight}>
                    <div className={styles.heroStat}>
                        <strong>{authState.connections?.length || 0}</strong>
                        <span>Connections</span>
                    </div>
                    <div className={styles.heroStat}>
                        <strong>24</strong>
                        <span>Profile views</span>
                    </div>
                    <button className={styles.heroProfileBtn} onClick={() => router.push('/profile')}>
                        View Profile <FaArrowRight />
                    </button>
                </div>
            </div>

            {/* Body: 2-column — feed on left, widgets on right */}
            <div className={styles.bodyGrid}>
                <div className={styles.mainContent}>
                    {children}
                </div>

                <aside className={styles.sidePanel}>
                    <div className={styles.newsCard}>
                        <h4><FaNewspaper /> ProConnect News</h4>
                        <ul>
                            <li>
                                <h5>AI is transforming the job market</h5>
                                <span>Top news • 1,205 readers</span>
                            </li>
                            <li>
                                <h5>The future of remote work is hybrid</h5>
                                <span>2d ago • 842 readers</span>
                            </li>
                            <li>
                                <h5>New trends in UI/UX for 2025</h5>
                                <span>3d ago • 567 readers</span>
                            </li>
                        </ul>
                    </div>

                    <div className={styles.peopleCard}>
                        <h4><FaUserPlus /> Add to your feed</h4>
                        {authState.all_profiles_fetched && authState.all_profiles.slice(0, 3).map((profile) => (
                            <div key={profile._id} className={styles.personItem}>
                                <img
                                    src={getAvatarUrl(profile.userId?.name || 'User', 48)}
                                    alt={profile.userId?.name}
                                />
                                <div className={styles.personInfo}>
                                    <h5>{profile.userId?.name}</h5>
                                    <p>@{profile.userId?.username}</p>
                                </div>
                                <button className={styles.followBtn}>+</button>
                            </div>
                        ))}
                    </div>

                    <div className={styles.recentCard}>
                        <h4><FaUsers /> Recent</h4>
                        <a href="#"><span>React Best Practices</span></a>
                        <a href="#"><span>UI/UX Design Group</span></a>
                        <a href="#"><span>Next.js 14 Features</span></a>
                    </div>
                </aside>
            </div>
        </div>
    );
}

