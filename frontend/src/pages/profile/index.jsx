import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import { getAboutUser } from '@/config/redux/action/authAction';
import { uploadProfilePicture, updateProfile, updateUser } from '@/config/redux/action/profileAction';
import { BASE_URL } from '@/config';
import styles from './profile.module.css';
import { generateResume } from '@/utils/resumeGenerator';
import { FaCamera, FaEdit, FaSave, FaPlus, FaTrash, FaDownload, FaTimes } from 'react-icons/fa';

export default function MyProfile() {
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    const [editing, setEditing] = useState(false);
    const [userData, setUserData] = useState({ name: '', username: '', email: '' });
    const [profileData, setProfileData] = useState({ bio: '', currentPost: '', education: [], work: [] });
    const [newEducation, setNewEducation] = useState({ school: '', degree: '', fieldOfStudy: '' });
    const [newWork, setNewWork] = useState({ company: '', position: '', years: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !authState.profilefetched) {
            dispatch(getAboutUser({ token }));
        }
    }, [authState.profilefetched, dispatch]);

    useEffect(() => {
        if (authState.user) {
            setUserData({
                name: authState.user.name || '',
                username: authState.user.username || '',
                email: authState.user.email || ''
            });
        }
        if (authState.profile) {
            setProfileData({
                bio: authState.profile.bio || '',
                currentPost: authState.profile.currentPost || '',
                education: authState.profile.education || [],
                work: authState.profile.work || []
            });
        }
    }, [authState.user, authState.profile]);

    const handleProfilePicUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            await dispatch(uploadProfilePicture(file));
            const token = localStorage.getItem('token');
            dispatch(getAboutUser({ token }));
        }
    };

    const handleSaveProfile = async () => {
        await dispatch(updateProfile(profileData));
        await dispatch(updateUser(userData));
        const token = localStorage.getItem('token');
        dispatch(getAboutUser({ token }));
        setEditing(false);
    };

    const addEducation = () => {
        if (newEducation.school && newEducation.degree) {
            setProfileData(prev => ({ ...prev, education: [...prev.education, newEducation] }));
            setNewEducation({ school: '', degree: '', fieldOfStudy: '' });
        }
    };

    const removeEducation = (index) => {
        setProfileData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
    };

    const addWork = () => {
        if (newWork.company && newWork.position) {
            setProfileData(prev => ({ ...prev, work: [...prev.work, newWork] }));
            setNewWork({ company: '', position: '', years: '' });
        }
    };

    const removeWork = (index) => {
        setProfileData(prev => ({ ...prev, work: prev.work.filter((_, i) => i !== index) }));
    };

    const handleDownloadResume = () => {
        if (authState.user && authState.profile) {
            generateResume(authState.user, authState.profile);
        }
    };

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.profileContainer}>
                    <header className={styles.profileHeader}>
                        <div className={styles.profileBanner} />
                        <div className={styles.profilePicSection}>
                            <img
                                className={styles.profilePic}
                                src={authState.user?.profilePicture ? `${BASE_URL}/uploads/${authState.user.profilePicture}` : '/images/default-profile.png'}
                                alt="Profile"
                            />
                            <label htmlFor="profilePicInput" className={styles.uploadBtn}>
                                <FaCamera />
                            </label>
                            <input
                                id="profilePicInput"
                                type="file"
                                hidden
                                onChange={handleProfilePicUpload}
                            />
                        </div>
                        <div className={styles.profileInfo}>
                            <h1>{authState.user?.name}</h1>
                            <p className={styles.username}>@{authState.user?.username}</p>
                            <p className={styles.currentPost}>{authState.profile?.currentPost || 'No position specified'}</p>
                        </div>
                        <div className={styles.profileActions}>
                            {editing ? (
                                <>
                                    <button onClick={handleSaveProfile} className={styles.saveBtn}><FaSave /> Save</button>
                                    <button onClick={() => setEditing(false)} className={`${styles.cancelBtn}`}><FaTimes /> Cancel</button>
                                </>
                            ) : (
                                <button onClick={() => setEditing(true)} className={styles.editBtn}><FaEdit /> Edit Profile</button>
                            )}
                            <button onClick={handleDownloadResume} className={styles.downloadBtn}><FaDownload /> Download Resume</button>
                        </div>
                    </header>

                    <main>
                        <section className={styles.profileSection}>
                            <h2 className={styles.sectionHeader}>About</h2>
                            {editing ? (
                                <div className={styles.inputGroup}>
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        rows="4"
                                    />
                                </div>
                            ) : (
                                <p>{profileData.bio || 'No bio available.'}</p>
                            )}
                        </section>

                        {editing && (
                             <section className={styles.profileSection}>
                                <h2 className={styles.sectionHeader}>Basic Information</h2>
                                <div className={styles.addForm}>
                                    <div className={styles.inputGroup}>
                                        <label>Name</label>
                                        <input value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Username</label>
                                        <input value={userData.username} onChange={(e) => setUserData({...userData, username: e.target.value})} />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Current Position</label>
                                        <input value={profileData.currentPost} onChange={(e) => setProfileData({...profileData, currentPost: e.target.value})} />
                                    </div>
                                </div>
                            </section>
                        )}

                        <section className={styles.profileSection}>
                            <h2 className={styles.sectionHeader}>Work Experience</h2>
                            <div className={styles.listContainer}>
                                {profileData.work.map((w, i) => (
                                    <div key={i} className={styles.listItem}>
                                        <div>
                                            <p><strong>{w.position}</strong> at {w.company}</p>
                                            <p>{w.years} years</p>
                                        </div>
                                        {editing && <button onClick={() => removeWork(i)} className={styles.removeBtn}><FaTrash /></button>}
                                    </div>
                                ))}
                            </div>
                            {editing && (
                                <div className={styles.addForm}>
                                    <div className={styles.inputGroup}>
                                        <input value={newWork.company} onChange={(e) => setNewWork({...newWork, company: e.target.value})} placeholder="Company" />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <input value={newWork.position} onChange={(e) => setNewWork({...newWork, position: e.target.value})} placeholder="Position" />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <input type="number" value={newWork.years} onChange={(e) => setNewWork({...newWork, years: e.target.value})} placeholder="Years" />
                                    </div>
                                    <button onClick={addWork} className={styles.addBtn}><FaPlus /> Add</button>
                                </div>
                            )}
                        </section>

                        <section className={styles.profileSection}>
                            <h2 className={styles.sectionHeader}>Education</h2>
                            <div className={styles.listContainer}>
                                {profileData.education.map((edu, i) => (
                                    <div key={i} className={styles.listItem}>
                                        <div>
                                            <p><strong>{edu.school}</strong></p>
                                            <p>{edu.degree}, {edu.fieldOfStudy}</p>
                                        </div>
                                        {editing && <button onClick={() => removeEducation(i)} className={styles.removeBtn}><FaTrash /></button>}
                                    </div>
                                ))}
                            </div>
                            {editing && (
                                <div className={styles.addForm}>
                                    <div className={styles.inputGroup}>
                                        <input value={newEducation.school} onChange={(e) => setNewEducation({...newEducation, school: e.target.value})} placeholder="School/University" />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <input value={newEducation.degree} onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})} placeholder="Degree" />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <input value={newEducation.fieldOfStudy} onChange={(e) => setNewEducation({...newEducation, fieldOfStudy: e.target.value})} placeholder="Field of Study" />
                                    </div>
                                    <button onClick={addEducation} className={styles.addBtn}><FaPlus /> Add</button>
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            </DashboardLayout>
        </UserLayout>
    );
}