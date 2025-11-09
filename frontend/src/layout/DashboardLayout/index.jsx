import React, { useEffect } from 'react';
import styles from './index.module.css';
import { useRouter } from 'next/router';
import { setTokenIsthere } from '@/config/redux/action/middleware/reducer/Authreducer';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserCircle, FaNewspaper, FaUsers } from 'react-icons/fa';
import { BASE_URL } from '@/config';

export default function DashboardLayout({ children }) {
    const authState = useSelector((state) => state.auth);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        dispatch(setTokenIsthere());
    }, [router, dispatch]);

    return (
        <div className={styles.layoutContainer}>
            <div className={styles.leftSidebar}>
                <div className={styles.profileCard}>
                    <div className={styles.profileBackground}></div>
                    <img 
                        src={authState.user?.profilePicture ? `${BASE_URL}/uploads/${authState.user.profilePicture}` : '/images/default-profile.png'} 
                        alt="Profile" 
                        className={styles.profileImage}
                        onClick={() => router.push('/profile')}
                    />
                    <h3 className={styles.profileName}>{authState.user?.name}</h3>
                    <p className={styles.profileHeadline}>{authState.profile?.currentPost || 'Web Developer'}</p>
                    <div className={styles.profileStats}>
                        <div>
                            <span>Connections</span>
                            <strong>{authState.connections?.length || 0}</strong>
                        </div>
                        <div>
                            <span>Who's viewed your profile</span>
                            <strong>24</strong>
                        </div>
                    </div>
                </div>
                <div className={styles.recentCard}>
                    <h4>Recent</h4>
                    <a href="#"><FaNewspaper /><span>React Best Practices</span></a>
                    <a href="#"><FaUsers /><span>UI/UX Design Group</span></a>
                    <a href="#"><FaNewspaper /><span>Next.js 14 Features</span></a>
                </div>
            </div>

            <div className={styles.mainContent}>
                {children}
            </div>

            <div className={styles.rightSidebar}>
                <div className={styles.newsCard}>
                    <h4>ProConnect News</h4>
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
                    <h4>Add to your feed</h4>
                    {authState.all_profiles_fetched && authState.all_profiles.slice(0, 3).map((profile) => (
                        <div key={profile._id} className={styles.personItem}>
                            <img 
                                src={profile.userId?.profilePicture ? `${BASE_URL}/uploads/${profile.userId.profilePicture}` : '/images/default-profile.png'} 
                                alt={profile.userId?.name} 
                            />
                            <div>
                                <h5>{profile.userId?.name}</h5>
                                <p>@{profile.userId?.username}</p>
                                <button>+ Follow</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

