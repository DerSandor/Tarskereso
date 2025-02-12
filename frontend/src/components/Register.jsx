import React, { useState } from 'react';
import { registerUser } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './AuthForm.css';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(email, username, password);
      toast.success('Sikeres regisztráció!');
      navigate('/login');
    } catch (error) {
      if (error.response?.data?.email) {
        toast.error('Ez az email cím már használatban van.');
      } else if (error.response?.data?.username) {
        toast.error('Ez a felhasználónév már foglalt.');
      } else {
        toast.error('Hiba történt a regisztráció során.');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Regisztráció</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Felhasználónév" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Regisztráció</button>
      </form>
      <div className="auth-links">
        <Link to="/login">Már van fiókod? Jelentkezz be!</Link>
      </div>
    </div>
  );
}

export default Register;
