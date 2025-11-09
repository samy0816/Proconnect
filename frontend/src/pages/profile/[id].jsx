import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import clientserver from '@/config';
import { BASE_URL } from '@/config';
import { sendConnectionRequest, getMyConnections, getConnectionRequests } from '@/config/redux/action/profileAction';
import styles from './profile.module.css';

export default function UserProfilePage(){
  const router = useRouter();
  const { id } = router.query; // This is actually username now
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('none'); // 'none', 'pending', 'connected'

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await clientserver.get('/user/get_all_users');
        const profiles = res.data?.profiles || res.data || [];
        // Find by username (id is actually username)
        const found = profiles.find(p => p.userId?.username === id);
        if (found) {
          setProfile(found);
          // Check connection status
          await checkConnectionStatus(found.userId._id);
        }
        else setError('Profile not found');
      } catch (err){
        setError(err?.response?.data?.message || err.message || 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  const checkConnectionStatus = async (targetUserId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Checking connection status for user:', targetUserId);
      
      // Check all my sent connections (including pending)
      const allMyConnectionsRes = await clientserver.get('/user/get_all_my_connections', {
        params: { token }
      });
      const allMyConnections = allMyConnectionsRes.data?.connections || [];
      console.log('All my sent connections:', allMyConnections);
      
      // Log each connection to see the structure
      allMyConnections.forEach((conn, index) => {
        console.log(`Connection ${index}:`, {
          connectedUserId: conn.connectedUserId?._id,
          connectedUserIdDirect: conn.connectedUserId,
          status: conn.status_accepted,
          targetUserId: targetUserId,
          match: conn.connectedUserId?._id === targetUserId,
          matchDirect: conn.connectedUserId === targetUserId
        });
      });
      
      // Check if connected (accepted) - handle both populated and non-populated cases
      const isConnected = allMyConnections.some(conn => {
        const connUserId = conn.connectedUserId?._id || conn.connectedUserId;
        return connUserId === targetUserId && conn.status_accepted === true;
      });
      
      if (isConnected) {
        console.log('Already connected');
        setConnectionStatus('connected');
        return;
      }

      // Check if pending (not accepted or null) - null means pending in old records
      const isPending = allMyConnections.some(conn => {
        const connUserId = conn.connectedUserId?._id || conn.connectedUserId;
        return connUserId === targetUserId && (conn.status_accepted === false || conn.status_accepted === null);
      });
      
      if (isPending) {
        console.log('Pending request (sent by me)');
        setConnectionStatus('pending');
        return;
      }

      // Check if this user has sent me a request
      const requestsRes = await clientserver.get('/user/what_are_my_connections', {
        params: { token }
      });
      const incomingRequests = requestsRes.data?.connections || [];
      console.log('Incoming requests:', incomingRequests);
      
      incomingRequests.forEach((req, index) => {
        console.log(`Request ${index}:`, {
          userId: req.userId?._id,
          userIdDirect: req.userId,
          status: req.status_accepted,
          targetUserId: targetUserId,
          match: req.userId?._id === targetUserId,
          matchDirect: req.userId === targetUserId
        });
      });
      
      const hasRequestedMe = incomingRequests.some(req => {
        const reqUserId = req.userId?._id || req.userId;
        return reqUserId === targetUserId && (req.status_accepted === false || req.status_accepted === null);
      });

      if (hasRequestedMe) {
        console.log('Pending request (sent to me)');
        setConnectionStatus('pending');
        return;
      }

      // No connection found
      console.log('No connection found');
      setConnectionStatus('none');
    } catch (err) {
      console.error('Error checking connection status:', err);
      setConnectionStatus('none');
    }
  };

  const handleSendConnection = async () => {
    if (!profile?.userId?._id) return;
    try {
      console.log('Sending connection request to:', profile.userId._id);
      const result = await dispatch(sendConnectionRequest(profile.userId._id)).unwrap();
      console.log('Connection request result:', result);
      setConnectionStatus('pending');
      // Re-check status after a short delay to ensure backend has saved
      setTimeout(() => {
        checkConnectionStatus(profile.userId._id);
      }, 500);
    } catch (err) {
      console.error('Connection request failed:', err);
      if (err?.includes('already')) {
        setConnectionStatus('pending');
      }
    }
  };

  const isOwnProfile = authState.user?.username === id;

  useEffect(() => {
    if (isOwnProfile && id) {
      router.push('/profile');
    }
  }, [isOwnProfile, id, router]);

  if (isOwnProfile) {
    return null;
  }

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.profileContainer}>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {profile && (
            <>
              <div className={styles.profileHeader}>
                <div className={styles.profilePicSection}>
                  <img 
                    src={`${BASE_URL}/uploads/${profile.userId?.profilePicture || 'default-profile.png'}`} 
                    alt="profile" 
                    className={styles.profilePic}
                  />
                </div>
                <div className={styles.profileInfo}>
                  <h1>{profile.userId?.name}</h1>
                  <p className={styles.username}>@{profile.userId?.username}</p>
                  <p className={styles.email}>{profile.userId?.email}</p>
                  <p className={styles.currentPost}>{profile.currentPost || 'No current position'}</p>
                  {connectionStatus === 'none' && (
                    <button onClick={handleSendConnection} className={styles.editBtn}>
                      Connect
                    </button>
                  )}
                  {connectionStatus === 'pending' && (
                    <button className={styles.cancelBtn} disabled>
                      Request Sent
                    </button>
                  )}
                  {connectionStatus === 'connected' && (
                    <button className={styles.cancelBtn} disabled>
                      Connected
                    </button>
                  )}
                </div>
              </div>

              {profile.bio && (
                <div className={styles.section}>
                  <h2>About</h2>
                  <p>{profile.bio}</p>
                </div>
              )}

              {profile.education && profile.education.length > 0 && (
                <div className={styles.section}>
                  <h2>Education</h2>
                  {profile.education.map((edu, index) => (
                    <div key={index} className={styles.item}>
                      <div>
                        <h4>{edu.degree} in {edu.fieldOfStudy}</h4>
                        <p>{edu.school}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {profile.work && profile.work.length > 0 && (
                <div className={styles.section}>
                  <h2>Experience</h2>
                  {profile.work.map((work, index) => (
                    <div key={index} className={styles.item}>
                      <div>
                        <h4>{work.position}</h4>
                        <p>{work.company} · {work.years} years</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}
