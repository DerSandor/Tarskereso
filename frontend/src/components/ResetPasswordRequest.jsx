import React, { useState } from 'react';
import { sendPasswordResetEmail } from '../api';
import { showToast } from '../utils/toastConfig';
import Layout from './Layout';

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(email);
      showToast('Visszaállítási link elküldve!', 'success');
    } catch (error) {
      console.error('Jelszó visszaállítási hiba:', error);
      showToast('Hiba történt a jelszó visszaállítása során.', 'error');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-fatal-dark mb-6 sm:mb-8 flex items-center">
          <span className="material-icons text-fatal-red mr-2">mail</span>
          Jelszó visszaállítása
        </h2>
        
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-fatal-gray mb-2" htmlFor="email">
              Email cím
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-2 border-fatal-red rounded-fatal
                       focus:ring-2 focus:ring-fatal-red focus:border-fatal-red
                       bg-fatal-light text-fatal-dark placeholder-fatal-gray"
              placeholder="pelda@email.com"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-fatal-red text-fatal-light py-3 px-6 rounded-fatal
                     hover:bg-fatal-hover transition-colors duration-200
                     flex items-center justify-center gap-2"
          >
            <span className="material-icons">send</span>
            Visszaállítási link küldése
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ResetPasswordRequest;
