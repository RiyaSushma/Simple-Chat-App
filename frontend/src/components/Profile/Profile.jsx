import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [profile, setProfile] = useState({
    username: '',
    emailId: '',
    profileImage: ''
  });
  const [newUsername, setNewUsername] = useState('');
  const [newEmailId, setNewEmailId] = useState('');
  const [newProfileImage, setNewProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setNewUsername(response.data.username);
        setNewEmailId(response.data.emailId);
        setNewProfileImage(response.data.profileImage);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', newUsername);
    formData.append('emailId', newEmailId);
    if (newProfileImage) {
      formData.append('profileImage', newProfileImage);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/auth/profile', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleProfileUpdate}>
        <div>
          <img
            src={profile.profileImage ? `/uploads/profile_images/${profile.profileImage}` : '/default-profile.png'}
            alt="Profile"
            style={{ width: '150px', height: '150px', borderRadius: '50%' }}
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={newEmailId}
            onChange={(e) => setNewEmailId(e.target.value)}
          />
        </div>
        <div>
          <label>Profile Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewProfileImage(e.target.files[0])}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;
