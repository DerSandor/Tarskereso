import axios from 'axios';


// API alapbeállítások (TÁVOLÍTSD EL a Content-Type fejlécet)
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  // NE add meg itt a 'Content-Type' fejlécet, mert az problémát okoz a fájlfeltöltésnél!
});

// Token frissítése, ha lejárt
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh: refreshToken });
          const newAccessToken = response.data.access;

          localStorage.setItem('access_token', newAccessToken);
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          console.error('Token frissítési hiba:', refreshError);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// API hívások
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/api/token/", {
      email,
      password,
    });

    const user = { email };

    // 🔥 Az access tokent `sessionStorage`-ba mentjük, hogy minden lapon külön legyen
    sessionStorage.setItem("access_token", response.data.access);
    sessionStorage.setItem("refresh_token", response.data.refresh);
    sessionStorage.setItem("user", JSON.stringify(user));

    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};


export const getProfile = (token) => {
  return api.get('profiles/me/', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// FONTOS: Itt se állítsd be a Content-Type-ot kézi módon!
export const updateProfile = (token, data) => {
  return api.patch('profiles/me/edit/', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const registerUser = (email, username, password) => {
  return api.post('users/register/', { email, username, password });
};

export const changePassword = (token, currentPassword, newPassword) => {
  return api.patch('users/change-password/', { current_password: currentPassword, new_password: newPassword }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const sendPasswordResetEmail = (email) => {
  return api.post('users/request-reset-password/', { email });
};

export const resetPasswordConfirm = (uid, token, newPassword) => {
  return api.post('users/reset-password-confirm/', {
    uid: uid,
    token: token,
    new_password: newPassword
  });
};

export const searchUsers = (token, query) => {
  return api.get(`users/search/?q=${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Üzenet küldése
export const sendMessage = (token, receiverId, content) => {
  return api.post('messages/', { receiver: receiverId, content }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Üzenetek lekérése
export const getMessages = (token) => {
  return api.get('messages/', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Felhasználó keresése email vagy felhasználónév alapján
export const getUserId = (token, identifier) => {
  return api.get(`users/get-id/?identifier=${identifier}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getNextProfile = async () => {
  let accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    console.error("Nincs access token!");
    return;
  }

  try {
    return await api.get("matches/next/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        const refreshResponse = await api.post("token/refresh/", {
          refresh: localStorage.getItem("refresh_token"),
        });

        // Új token mentése
        localStorage.setItem("access_token", refreshResponse.data.access);
        accessToken = refreshResponse.data.access;

        // Újrapróbálkozás
        return await api.get("matches/next/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } catch (refreshError) {
        console.error("Token frissítési hiba:", refreshError);
        return;
      }
    }

    console.error("Hiba a profilok betöltésekor:", error);
    throw error;
  }
};

export const sendLikeDislike = async (likedUserId, liked) => {
  let accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    console.error("Nincs access token!");
    return;
  }

  try {
    return await api.post(
      "matches/like/",
      { liked_user_id: likedUserId, liked },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        const refreshResponse = await api.post("token/refresh/", {
          refresh: localStorage.getItem("refresh_token"),
        });

        // Új token mentése
        localStorage.setItem("access_token", refreshResponse.data.access);
        accessToken = refreshResponse.data.access;

        // Újrapróbálkozás
        return await api.post(
          "matches/like/",
          { liked_user_id: likedUserId, liked },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      } catch (refreshError) {
        console.error("Token frissítési hiba:", refreshError);
        return;
      }
    }

    console.error("Hiba a like/dislike küldése közben:", error);
    throw error;
  }
};



