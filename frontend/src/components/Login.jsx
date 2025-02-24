import React, { useState, useEffect } from 'react';
import { loginUser } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { showToast } from '../utils/toastConfig';
import Layout from './Layout';
import { useAuth } from '../authContext.jsx';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (shouldNavigate) {
      navigate('/swipe');
    }
  }, [shouldNavigate, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      if (response.data.access) {
        sessionStorage.setItem("access_token", response.data.access);
        sessionStorage.setItem("username", email);
        login(response.data.access);
        showToast('Sikeres bejelentkezés!', 'success');
        setShouldNavigate(true);
      }
    } catch (err) {
      showToast('Hibás email vagy jelszó!', 'error');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-fatal-dark mb-6 sm:mb-8 flex items-center">
          <span className="material-icons text-fatal-red mr-2">login</span>
          Bejelentkezés
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
            <span className="material-icons">login</span>
            Bejelentkezés
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link 
            to="/register" 
            className="block text-fatal-red hover:text-fatal-hover transition-colors"
          >
            Még nincs fiókod? Regisztrálj!
          </Link>
          <Link 
            to="/reset-password" 
            className="block text-fatal-gray hover:text-fatal-red transition-colors"
          >
            Elfelejtetted a jelszót?
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default Login;
