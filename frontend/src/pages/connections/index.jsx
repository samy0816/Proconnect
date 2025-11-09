import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import { getMyConnections, getConnectionRequests, respondToConnection } from '@/config/redux/action/profileAction';
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';
import styles from './connections.module.css';

export default function MyConnectionsPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [connections, setConnections] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('connections'); // 'connections' or 'requests'

    useEffect(() => {
        fetchConnections();
        fetchRequests();
    }, []);

    const fetchConnections = async () => {
        setLoading(true);
        try {
            const result = await dispatch(getMyConnections()).unwrap();
            console.log('Connections result:', result);
            setConnections(result.connections || []);
        } catch (err) {
            console.error('Failed to fetch connections:', err);
            setConnections([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const result = await dispatch(getConnectionRequests()).unwrap();
            console.log('Requests result:', result);
            setRequests(result.connections || []);
        } catch (err) {
            console.error('Failed to fetch requests:', err);
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (requestId) => {
        try {
            await dispatch(respondToConnection({ requestId, action_type: 'accept' })).unwrap();
            // Remove from requests immediately
            setRequests(prev => prev.filter(req => req._id !== requestId));
            // Refresh both lists
            await fetchRequests();
            await fetchConnections();
        } catch (err) {
            console.error('Failed to accept:', err);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await dispatch(respondToConnection({ requestId, action_type: 'reject' })).unwrap();
            // Remove from requests immediately
            setRequests(prev => prev.filter(req => req._id !== requestId));
            await fetchRequests();
        } catch (err) {
            console.error('Failed to reject:', err);
        }
    };

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.container}>
                    <h1>My Connections</h1>
                    
                    <div className={styles.tabs}>
                        <button 
                            className={activeTab === 'connections' ? styles.activeTab : styles.tab}
                            onClick={() => setActiveTab('connections')}
                        >
                            Connections ({connections.length})
                        </button>
                        <button 
                            className={activeTab === 'requests' ? styles.activeTab : styles.tab}
                            onClick={() => setActiveTab('requests')}
                        >
                            Requests ({requests.length})
                        </button>
                    </div>

                    {loading && <p>Loading...</p>}

                    {activeTab === 'connections' && (
                        <div className={styles.list}>
                            {connections.length === 0 ? (
                                <p className={styles.empty}>No connections yet. Start connecting with people!</p>
                            ) : (
                                connections.map((conn) => (
                                    <div key={conn._id} className={styles.card}>
                                        <img 
                                            src={`${BASE_URL}/uploads/${conn.connectedUserId?.profilePicture || 'default-profile.png'}`}
                                            alt="profile"
                                            className={styles.avatar}
                                        />
                                        <div className={styles.info}>
                                            <h3>{conn.connectedUserId?.name}</h3>
                                            <p>@{conn.connectedUserId?.username}</p>
                                        </div>
                                        <button 
                                            onClick={() => router.push(`/profile/${conn.connectedUserId?.username}`)}
                                            className={styles.viewBtn}
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'requests' && (
                        <div className={styles.list}>
                            {requests.length === 0 ? (
                                <p className={styles.empty}>No pending requests.</p>
                            ) : (
                                requests.map((req) => (
                                    <div key={req._id} className={styles.card}>
                                        <img 
                                            src={`${BASE_URL}/uploads/${req.userId?.profilePicture || 'default-profile.png'}`}
                                            alt="profile"
                                            className={styles.avatar}
                                        />
                                        <div className={styles.info}>
                                            <h3>{req.userId?.name}</h3>
                                            <p>@{req.userId?.username}</p>
                                        </div>
                                        <div className={styles.actions}>
                                            <button 
                                                onClick={() => handleAccept(req._id)}
                                                className={styles.acceptBtn}
                                            >
                                                Accept
                                            </button>
                                            <button 
                                                onClick={() => handleReject(req._id)}
                                                className={styles.rejectBtn}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </UserLayout>
    );
}
