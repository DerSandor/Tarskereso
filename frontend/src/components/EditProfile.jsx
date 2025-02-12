import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();

  useEffect(() => {
    getProfile(token).then(response => {
      setBio(response.data.bio);
      setInterests(response.data.interests);
      setProfilePicture(response.data.profile_picture);
    });
  }, [token]);

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('bio', bio);
    formData.append('interests', interests);
    if (profilePicture instanceof File) {
      formData.append('profile_picture', profilePicture);
    }

    updateProfile(token, formData)
  .then(() => {
    toast.success('Profil sikeresen frissítve!');
    navigate('/profile');
    window.location.reload();  // Az oldal újratöltése a kép frissítése után
  })
  .catch(() => {
    toast.error('Hiba történt a profil frissítése során.');
  });

  };

  return (
    <div>
      <h2>Profil szerkesztése</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        <input type="text" placeholder="Érdeklődés" value={interests} onChange={(e) => setInterests(e.target.value)} />
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit">Mentés</button>
      </form>
    </div>
  );
};

export default EditProfile;
