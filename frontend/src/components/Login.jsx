import React, { useState } from 'react';
import { loginUser } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './AuthForm.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(email, password);
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        toast.success('Sikeres bejelentkezés!');
        navigate('/profile');
      } else {
        toast.error('Hiba történt a token lekérés során.');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Hibás email cím vagy jelszó.');
      } else {
        toast.error(`Bejelentkezési hiba: ${error.response?.data?.detail || 'Ismeretlen hiba'}`);
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Bejelentkezés</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Bejelentkezés</button>
      </form>
      <div className="auth-links">
        <Link to="/register">Nincs fiókod? Regisztrálj!</Link>
        <Link to="/reset-password">Elfelejtetted a jelszót?</Link>
      </div>
    </div>
  );
}

export default Login;
