import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { useSelector, useDispatch } from 'react-redux';
import { getallUsers } from '@/config/redux/action/authAction';
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';




export default function Discoverpage() {
    const authState=useSelector((state)=>state.auth);
    const dispatch=useDispatch();
    const router = useRouter();


    useEffect(() => {
        if(!authState.all_profiles_fetched) {
            dispatch(getallUsers());
        }

    }, [authState.all_profiles_fetched, dispatch]);
  return (
      <UserLayout>
             <DashboardLayout>
 <div>
     <h1>Discover</h1>


    {/* Vertical list with scroll */}
    <div className="alluserprofiles" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
        {(authState.all_profiles && authState.all_profiles.length > 0) ? authState.all_profiles.map((profile)=>(
            <div key={profile._id} className="userprofilecard" style={{ cursor: 'pointer', background: 'white', padding: '0.9rem 1rem', borderRadius: '8px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '1rem' }} onClick={()=>{
                const username = profile.userId?.username;
                if (username) {
                    router.push(`/profile/${username}`);
                }
            }}>
                <img src={`${BASE_URL}/uploads/${profile.userId?.profilePicture || 'default-profile.png'}`} alt="profile" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>{profile.userId?.name || profile.name}</h3>
                    <p style={{ margin: 0, color: 'gray', fontSize: '0.9rem' }}>@{profile.userId?.username}</p>
                </div>
            </div>
        )) : <p>No profiles found.</p>}
    </div>
    </div>
             </DashboardLayout>
         </UserLayout>
  )
}
