import React, { useState } from 'react';
import { sendPasswordResetEmail } from '../api';
import { toast } from 'react-toastify';
import './AuthForm.css';  // Új stílus fájl importálása

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(email);
      toast.success('Visszaállítási link elküldve!');
    } catch (error) {
      console.error('Jelszó visszaállítási hiba:', error);
      toast.error('Hiba történt a jelszó visszaállítása során.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Jelszó visszaállítása</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email cím"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Visszaállítási link küldése</button>
      </form>
    </div>
  );
};

export default ResetPasswordRequest;
