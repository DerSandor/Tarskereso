import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './AuthForm.css';

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState(false);  // Új állapot a sikeres művelethez
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/users/reset-password-confirm/', {
        uid,
        token,
        new_password: newPassword
      });
      setSuccess(true);  // Siker állapot beállítása
      toast.success('A jelszó sikeresen megváltoztatva! Átirányítás a bejelentkezéshez...');
      setTimeout(() => navigate('/login'), 3000);  // 3 másodperc múlva átirányít a bejelentkezéshez
    } catch (error) {
      toast.error(error.response?.data?.error || 'Hiba történt a jelszó visszaállítása során.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Új jelszó beállítása</h2>
      {!success ? (
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Új jelszó"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Jelszó mentése</button>
        </form>
      ) : (
        <p style={{ textAlign: 'center', color: 'green', fontWeight: 'bold' }}>
          A jelszó sikeresen módosítva! Átirányítás a bejelentkezéshez...
        </p>
      )}
    </div>
  );
};

export default ResetPasswordConfirm;
