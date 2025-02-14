import { useEffect, useState } from 'react';
import { getProfile } from '../api';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    getProfile(token).then(response => setProfile(response.data));
  }, [token]);

  return (
    <div>
      <h1>Profilom</h1>
      {profile ? (
        <div>
          <p><strong>Bio:</strong> {profile.bio}</p>
          <p><strong>Érdeklődés:</strong> {profile.interests}</p>
          {profile.profile_picture && (
            <img src={profile.profile_picture} alt="Profil kép" width="150" />
          )}

          <Link to="/profile/change-password">
            <button>Jelszó megváltoztatása</button>
          </Link>
          {/* 🔥 Hozzáadjuk a gombot a Swipe oldalhoz */}
          <Link to="/swipe">
            <button style={{ padding: "10px 20px", backgroundColor: "blue", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              Profilok böngészése
            </button>
          </Link>
        </div>
      ) : (
        <p>Betöltés...</p>
      )}
    </div>
  );
};

export default Profile;
