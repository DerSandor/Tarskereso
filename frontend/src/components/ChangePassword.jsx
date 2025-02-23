import React, { useState } from 'react';
import { changePassword } from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    changePassword(token, currentPassword, newPassword)
      .then(() => {
        toast.success('Jelszó sikeresen megváltoztatva!');
        navigate('/profile');
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || 'Hiba történt a jelszó megváltoztatása során.');
      });
  };

  return (
    <div>
      <h2>Jelszó megváltoztatása</h2>
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="Jelenlegi jelszó" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        <input type="password" placeholder="Új jelszó" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        <button type="submit">Jelszó mentése</button>
      </form>
    </div>
  );
};

export default ChangePassword;
