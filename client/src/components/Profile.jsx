import { useEffect, useState,  } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

function Profile() {
    const [profile, setProfile] = useState(null);
    
    useEffect(() => {
        
        const fetchProfile = async () => {
            
            try {
                const response = await axios.get('http://localhost:3000/profile', { withCredentials: true });
                setProfile(response.data);
            } catch (error) {
                
                alert(error.response.data);
               
                window.location.href = '/';
            }
        };

        fetchProfile();
    }, []);
    const navigate = useNavigate()
    const handleLogout = async () => {
       
        try {
            await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
            navigate('/')
            // window.location.href = '/';
        } catch (error) {
            alert(error.response.data);
        }
    };

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Profile</h2>
            <p>Username: {profile.username}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Profile;