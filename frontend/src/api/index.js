import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Felhasználói regisztráció
export const registerUser = (email, username, password, gender) => {
  return axios.post(`${API_BASE_URL}/users/register/`, {
    email,
    username,
    password,
    gender
  });
};

// Bejelentkezés
export const loginUser = (email, password) => {
  return axios.post(`${API_BASE_URL}/token/`, {
    email,
    password
  });
};

// Profil lekérdezése
export const getProfile = (token) => {
  return axios.get(`${API_BASE_URL}/profiles/me/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
