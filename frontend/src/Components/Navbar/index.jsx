import React, { useState, useEffect } from 'react';
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from 'react-redux';
import { getAboutUser } from '@/config/redux/action/authAction';
import { reset as resetAuth, setTokenIsthere, setTokenNotthere } from '@/config/redux/action/middleware/reducer/Authreducer';
import { FaHome, FaUserFriends, FaBriefcase, FaCommentDots, FaBell, FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !authState.loggedin) {
            dispatch(getAboutUser({ token }));
            dispatch(setTokenIsthere());
        }
    }, [authState.loggedin, dispatch]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(resetAuth());
        dispatch(setTokenNotthere());
        router.push('/login');
    };

    return (
        <header className={styles.header}>
            <div className={`${styles.container} container`}>
                <div className={styles.logoSearch}>
                    <h1 onClick={() => router.push("/")} className={styles.logo}>ProConnect</h1>
                    {authState.loggedin && (
                        <div className={styles.searchBar}>
                            <input type="text" placeholder="Search" />
                        </div>
                    )}
                </div>

                {authState.loggedin && authState.user ? (
                    <nav className={styles.navLinks}>
                        <a className={router.pathname === '/dashboard' ? styles.active : ''} onClick={() => router.push('/dashboard')}><FaHome /><span>Home</span></a>
                        <a className={router.pathname === '/discover' ? styles.active : ''} onClick={() => router.push('/discover')}><FaUserFriends /><span>My Network</span></a>
                        
                        <div className={styles.profileMenu}>
                            <button onClick={() => setShowDropdown(!showDropdown)} className={styles.profileBtn}>
                                <FaUserCircle />
                                <span>Me ▼</span>
                            </button>
                            {showDropdown && (
                                <div className={styles.dropdown}>
                                    <div className={styles.dropdownHeader}>
                                        <FaUserCircle size={40} />
                                        <div>
                                            <p className={styles.dropdownName}>{authState.user.name}</p>
                                            <p className={styles.dropdownUsername}>@{authState.user.username}</p>
                                        </div>
                                    </div>
                                    <a onClick={() => { router.push('/profile'); setShowDropdown(false); }}>View Profile</a>
                                    <a onClick={() => { handleLogout(); setShowDropdown(false); }}>Logout</a>
                                </div>
                            )}
                        </div>
                    </nav>
                ) : (
                    <div className={styles.authButtons}>
                        <button onClick={() => router.push("/login")} className={styles.loginBtn}>Sign In</button>
                        <button onClick={() => router.push("/register")} className={styles.joinBtn}>Join Now</button>
                    </div>
                )}
            </div>
        </header>
    );
}