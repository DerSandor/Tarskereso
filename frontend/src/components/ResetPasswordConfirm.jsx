import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showToast } from '../utils/toastConfig';
import Layout from './Layout';

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/users/reset-password-confirm/', {
        uid,
        token,
        new_password: newPassword
      });
      setSuccess(true);
      showToast('A jelszó sikeresen megváltoztatva!', 'success');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      showToast(
        error.response?.data?.error || 'Hiba történt a jelszó visszaállítása során.',
        'error'
      );
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-fatal-dark mb-6 sm:mb-8 flex items-center">
          <span className="material-icons text-fatal-red mr-2">lock_reset</span>
          Új jelszó beállítása
        </h2>

        {!success ? (
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-fatal-gray mb-2" htmlFor="newPassword">
                Új jelszó
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border-2 border-fatal-red rounded-fatal
                         focus:ring-2 focus:ring-fatal-red focus:border-fatal-red
                         bg-fatal-light text-fatal-dark"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-fatal-red text-fatal-light py-3 px-6 rounded-fatal
                       hover:bg-fatal-hover transition-colors duration-200
                       flex items-center justify-center gap-2"
            >
              <span className="material-icons">save</span>
              Jelszó mentése
            </button>
          </form>
        ) : (
          <div className="text-center py-6 text-fatal-dark">
            <span className="material-icons text-4xl sm:text-6xl text-fatal-red mb-4">
              check_circle
            </span>
            <p className="text-lg sm:text-xl font-bold">
              A jelszó sikeresen módosítva!
            </p>
            <p className="mt-2 text-sm sm:text-base text-fatal-gray">
              Átirányítás a bejelentkezéshez...
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ResetPasswordConfirm;
