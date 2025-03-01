import React, { useState } from 'react';
import { registerUser } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { showToast } from '../utils/toastConfig';
import Layout from './Layout';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('O');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Regisztrációs adatok:', { email, username, password, gender });
      const response = await registerUser(email, username, password, gender);
      console.log('Sikeres regisztráció:', response);
      showToast('Sikeres regisztráció!', 'success');
      navigate('/login');
    } catch (error) {
      console.error('Regisztrációs hiba teljes válasz:', error.response);
      if (error.response?.data) {
        console.error('Szerver hibaüzenet:', error.response.data);
        if (error.response.data.email) {
          showToast('Ez az email cím már használatban van.', 'error');
        } else if (error.response.data.username) {
          showToast('Ez a felhasználónév már foglalt.', 'error');
        } else {
          showToast(`Hiba történt a regisztráció során: ${JSON.stringify(error.response.data)}`, 'error');
        }
      } else {
        showToast('Hiba történt a regisztráció során.', 'error');
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-fatal shadow-fatal">
        <h2 className="text-2xl font-bold text-center text-fatal-dark mb-6">
          Regisztráció
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                       bg-fatal-light text-fatal-dark"
              placeholder="pelda@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-fatal-gray mb-2" htmlFor="username">
              Felhasználónév
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border-2 border-fatal-red rounded-fatal
                       focus:ring-2 focus:ring-fatal-red focus:border-fatal-red
                       bg-fatal-light text-fatal-dark placeholder-fatal-gray"
              placeholder="felhasználónév"
              required
            />
          </div>

          <div>
            <label className="block text-fatal-gray mb-2" htmlFor="gender">
              Nem
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-3 border-2 border-fatal-red rounded-fatal
                       focus:ring-2 focus:ring-fatal-red focus:border-fatal-red
                       bg-fatal-light text-fatal-dark"
              required
            >
              <option value="M">Férfi</option>
              <option value="F">Nő</option>
              <option value="O">Egyéb</option>
            </select>
          </div>
          
          <div>
            <label className="block text-fatal-gray mb-2" htmlFor="password">
              Jelszó
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <span className="material-icons">how_to_reg</span>
            Regisztráció
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="text-fatal-red hover:text-fatal-hover transition-colors"
          >
            Már van fiókod? Jelentkezz be!
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default Register;
