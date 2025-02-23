import React, { useState } from 'react';
import { loginUser } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toastConfig } from '../utils/toastConfig';
import Layout from './Layout';
import { useAuth } from '../authContext.jsx';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      if (response.data.access) {
        login(response.data.access);
        localStorage.setItem('username', email);
        toast.success('Sikeres bejelentkezés!', {
          ...toastConfig,
          icon: '✅',
          toastId: 'login-success'
        });
        navigate('/swipe');
      }
    } catch (err) {
      toast.error('Hibás email vagy jelszó!', {
        ...toastConfig,
        icon: '❌',
        toastId: 'login-error'
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-fatal-dark mb-8 flex items-center">
          <span className="material-icons text-fatal-red mr-2">login</span>
          Bejelentkezés
        </h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
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
