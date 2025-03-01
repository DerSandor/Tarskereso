import axios from 'axios';

// API alapbeállítások
const apiInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Token frissítése, ha lejárt
apiInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = sessionStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh: refreshToken });
          const newAccessToken = response.data.access;

          sessionStorage.setItem("access_token", newAccessToken);
          apiInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return apiInstance(originalRequest);
        } catch (refreshError) {
          console.error("❌ Token frissítési hiba:", refreshError);
          sessionStorage.clear();
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

const loginUser = async (email, password) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/api/token/", {
      email,
      password,
    });

    if (response.data.access && response.data.refresh) {
      sessionStorage.setItem("access_token", response.data.access);
      sessionStorage.setItem("refresh_token", response.data.refresh);
      apiInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
      return response;
    } else {
      throw new Error("Hibás válasz a szervertől.");
    }
  } catch (error) {
    console.error("Bejelentkezési hiba:", error);
    throw error;
  }
};

const getProfile = async () => {
  const token = sessionStorage.getItem("access_token");
  if (!token) {
    console.error("❌ Nincs access token elmentve!");
    return;
  }
  return apiInstance.get("profiles/me/", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const updateProfile = async (token, data) => {
  try {
    const response = await apiInstance.patch('profiles/me/edit/', data, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true
    });
    return response;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token frissítés már automatikusan megtörténik az interceptorban
      console.log("Token frissítés folyamatban...");
    } else {
      console.error("Profil frissítési hiba:", error);
    }
    throw error;
  }
};

const registerUser = (email, username, password, gender) => {
  return apiInstance.post('users/register/', { 
    email, 
    username, 
    password,
    gender 
  });
};

const changePassword = (token, currentPassword, newPassword) => {
  return apiInstance.patch('users/change-password/', 
    { current_password: currentPassword, new_password: newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

const sendPasswordResetEmail = (email) => {
  return apiInstance.post('users/request-reset-password/', { email });
};

const resetPasswordConfirm = (uid, token, newPassword) => {
  return apiInstance.post('users/reset-password-confirm/', {
    uid: uid,
    token: token,
    new_password: newPassword
  });
};

const searchUsers = async (query) => {
  const token = sessionStorage.getItem('access_token');
  return apiInstance.get(`users/search/?q=${query}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

const getMatchedUsers = async () => {
  const token = sessionStorage.getItem("access_token");
  if (!token) {
    window.location.href = "/login";
    return [];
  }

  try {
    const response = await apiInstance.get("matches/matched-users/", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Match-ek lekérési hiba:", error);
    if (error.response?.status === 401) {
      sessionStorage.clear();
      window.location.href = "/login";
    }
    throw error;
  }
};

const getConversations = async () => {
  const token = sessionStorage.getItem("access_token");
  if (!token) {
    console.error("❌ Nincs access token elmentve!");
    return null;
  }
  try {
    const response = await apiInstance.get("messages/conversations/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Hiba a beszélgetések lekérésekor:", error);
    return null;
  }
};

const getMessages = async (conversationId) => {
  const token = sessionStorage.getItem("access_token");
  if (!token) {
    window.location.href = "/login";
    return [];
  }

  try {
    const response = await apiInstance.get(`messages/conversations/${conversationId}/messages/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Üzenetek lekérési hiba:", error);
    if (error.response?.status === 401) {
      sessionStorage.clear();
      window.location.href = "/login";
    }
    throw error;
  }
};

const sendMessage = (token, conversationId, content) => {
  return apiInstance.post(`messages/send/${conversationId}/`, 
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

const getUserId = (token, identifier) => {
  return apiInstance.get(`users/get-id/?identifier=${identifier}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getNextProfile = async (reset = false) => {
  try {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
      console.error("Nincs access token!");
      window.location.href = "/login";
      return;
    }
    const response = await apiInstance.get(`matches/next/${reset ? '?reset=true' : ''}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    if (error.response?.status === 401) {
      sessionStorage.clear();
      window.location.href = "/login";
      return;
    }
    console.error("Hiba a profilok betöltésekor:", error);
    throw error;
  }
};

const sendLikeDislike = async (liked, profileId) => {
  if (!profileId) {
    console.error('Missing profileId:', { liked, profileId });
    throw new Error('Hiányzó profil azonosító');
  }

  try {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    console.log('Sending like/dislike request:', { liked, profileId });  // Debug log
    
    const response = await apiInstance.post(
      "matches/like-dislike/",
      {
        liked_user_id: profileId,
        liked: liked
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Hiba a like/dislike küldése közben:", error);
    throw error;
  }
};

const getConversationDetails = async (conversationId) => {
  try {
    const token = sessionStorage.getItem("access_token");
    const response = await apiInstance.get(
      `messages/conversations/${conversationId}/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Hiba a beszélgetés lekérésekor:", error);
    return null;
  }
};

const getUserById = async (userId) => {
  try {
    const token = sessionStorage.getItem("access_token");
    const response = await apiInstance.get(
      `users/${userId}/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Hiba a felhasználó (${userId}) lekérésekor:`, error);
    return { username: `Ismeretlen (${userId})` };
  }
};

const getUserProfile = async (userId) => {
  const token = sessionStorage.getItem('access_token');
  try {
    // Használjuk a már működő search API-t
    const response = await apiInstance.get(`users/search/?q=${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const user = response.data.find(u => u.id === parseInt(userId));
    if (!user) throw new Error('User not found');
    
    return { 
      data: {
        ...user,
        id: parseInt(userId)
      }
    };
  } catch (err) {
    console.error('Profil lekérési hiba:', err);
    throw err;
  }
};

export {
  loginUser,
  getProfile,
  updateProfile,
  registerUser,
  changePassword,
  sendPasswordResetEmail,
  resetPasswordConfirm,
  searchUsers,
  getMatchedUsers,
  getConversations,
  getMessages,
  sendMessage,
  getUserId,
  getNextProfile,
  sendLikeDislike,
  getConversationDetails,
  getUserById,
  getUserProfile
};

export default apiInstance;