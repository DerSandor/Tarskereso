import React, { useState } from 'react';
import { changePassword } from '../api';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toastConfig';
import Layout from './Layout';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changePassword(token, currentPassword, newPassword);
      showToast('Jelszó sikeresen megváltoztatva!', 'success');
      navigate('/profile');
    } catch (error) {
      showToast(
        error.response?.data?.error || 'Hiba történt a jelszó megváltoztatása során.',
        'error'
      );
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-fatal-dark mb-8 flex items-center">
          <span className="material-icons text-fatal-red mr-2">lock</span>
          Jelszó megváltoztatása
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-fatal-gray mb-2" htmlFor="currentPassword">
              Jelenlegi jelszó
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 border-2 border-fatal-red rounded-fatal
                       focus:ring-2 focus:ring-fatal-red focus:border-fatal-red
                       bg-fatal-light text-fatal-dark"
              required
            />
          </div>

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
      </div>
    </Layout>
  );
};

export default ChangePassword;
